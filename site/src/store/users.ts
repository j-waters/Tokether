import { acceptHMRUpdate, defineStore } from "pinia";
import { useRoomStore } from "@/store/room";
import { generateId } from "@/helpers/generate";
import { IGunChainReference } from "gun/types/chain";
import { differenceInSeconds, compareAsc, isBefore } from "date-fns";
import { useGlobalStore } from "@/store/global";
import { StoredUser } from "@/helpers/database";

interface UserState {
  userId: string;
  users: User[];
  rawUsers: Record<string, StoredUser>;
  intervalId?: number;
  username: string | null;
  joinTime: Date | null;
  lastSentUpdate: Date | null;
  hasConnected: boolean;
}

export interface User extends StoredUser {
  lastUpdateDiff: number;
  connectionStatus: UserConnectionStatus;
  isConnected: boolean;
  isCurrent: boolean;
}

const HEARTBEAT_INTERVAL = 4;
const DISCONNECT_AFTER = HEARTBEAT_INTERVAL * 4;
const REMOVE_AFTER = DISCONNECT_AFTER * 2;

type UserConnectionStatus = "good" | "poor" | "disconnected" | "remove";

function ingestUser(user: StoredUser): User {
  const usersStore = useUsersStore();
  const lastUpdateDiff = differenceInSeconds(
    new Date(),
    new Date(user.lastUpdate)
  );
  const connectionStatus: UserConnectionStatus =
    lastUpdateDiff <= HEARTBEAT_INTERVAL
      ? "good"
      : lastUpdateDiff < DISCONNECT_AFTER
      ? "poor"
      : lastUpdateDiff < REMOVE_AFTER
      ? "disconnected"
      : "remove";
  return {
    ...user,
    lastUpdateDiff,
    connectionStatus,
    isConnected: lastUpdateDiff < DISCONNECT_AFTER,
    isCurrent: user.userId == usersStore.userId,
  };
}

export const useUsersStore = defineStore("users", {
  state: () =>
    ({
      userId: generateId(16),
      rawUsers: {},
      users: [],
      username: localStorage.getItem("username"),
      joinTime: null,
      lastSentUpdate: null,
      hasConnected: false,
    } as UserState),
  actions: {
    init() {
      this.joinTime = new Date();
      this.startHeartbeat();

      this.gunUsers.map().on(
        // @ts-ignore
        (storedUser: StoredUser, userId) => {
          this.ingestUser(storedUser, userId);
        },
        {
          change: true,
        }
      );
    },
    startHeartbeat() {
      console.log("start heartbeat");
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        this.heartbeat();
        this.processUsers();
      }, HEARTBEAT_INTERVAL * 1000);
      this.heartbeat();
    },
    ingestUser(storedUser: StoredUser | null, userId: string) {
      if (storedUser == null) {
        delete this.rawUsers[userId];
      } else {
        if (
          userId != this.userId ||
          storedUser.lastUpdate == this.lastSentUpdate?.toString()
        ) {
          this.rawUsers[userId] = storedUser;
        }
      }
      this.processUsers();
    },
    processUsers() {
      this.users = Object.values(this.rawUsers)
        .map((user) => ingestUser(user))
        .sort((a, b) =>
          a.isCurrent
            ? -1
            : compareAsc(new Date(a.joinTime), new Date(b.joinTime))
        );

      const currentUser = this.users.find((u) => u.isCurrent);

      if (currentUser != undefined) {
        this.hasConnected = true;
      }

      this.users
        .filter((user) => user.lastUpdateDiff > REMOVE_AFTER)
        .forEach((user) => {
          this.gunUsers.get(user.userId).put(null);
          delete this.rawUsers[user.userId];
        });

      if (this.hasConnected) {
        if (
          currentUser == undefined ||
          currentUser.lastUpdateDiff > DISCONNECT_AFTER
        ) {
          console.log("bad heartbeat", currentUser?.lastUpdateDiff);
          this.hasConnected = false;
          this.startHeartbeat();
        }
      }
    },
    heartbeat() {
      const cur = this.getCurrentBasicUser();
      this.lastSentUpdate = new Date(cur.lastUpdate);
      this.gunUser.put(cur);
    },
    setLoaded(itemId: string) {
      this.gunUser.put({ loaded: itemId });
    },
    leave() {
      clearInterval(this.intervalId);
      this.gunUsers.off();
    },
    setUsername(username: string) {
      this.username = username;
      localStorage.setItem("username", username);
      this.heartbeat();
    },
  },
  getters: {
    gunUsers(): IGunChainReference<
      Record<string, StoredUser | null>,
      "users",
      false
    > {
      const roomStore = useRoomStore();
      return roomStore.gunRoom.get(`users`);
    },
    gunUser(): IGunChainReference<StoredUser | null, string, false> {
      return this.gunUsers.get(this.userId);
    },
    activeUsers(): User[] {
      return [
        ...this.users.filter((user) => {
          return user.isCurrent || user.isConnected;
        }),
      ];
    },
    allLoaded(): boolean {
      const roomStore = useRoomStore();
      return this.activeUsers.every(
        (user) => user.loaded == roomStore.currentItemId
      );
    },
    getCurrentBasicUser(): () => StoredUser {
      return () => ({
        lastUpdate: new Date().toString(),
        username: this.username,
        hasExtension: useGlobalStore().hasExtension,
        userId: this.userId,
        joinTime: this.joinTime!.toString(),
      });
    },
    currentUser(): User {
      return ingestUser(this.getCurrentBasicUser());
    },
  },
});

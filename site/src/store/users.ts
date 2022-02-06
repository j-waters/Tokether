import { defineStore } from "pinia";
import { useRoomStore } from "@/store/room";
import { generateId } from "@/helpers/generate";
import { IGunChainReference } from "gun/types/chain";
import { differenceInSeconds, compareAsc } from "date-fns";
import { useGlobalStore } from "@/store/global";
import { StoredUser } from "@/helpers/database";

interface UserState {
  userId: string;
  users: User[];
  intervalId?: number;
  username: string | null;
  joinTime: Date | null;
}

export interface User extends StoredUser {
  connectionStrength: number;
  isConnected: boolean;
  isCurrent: boolean;
}

const DISCONNECT_AFTER = 10;

function ingestUser(user: StoredUser): User {
  const usersStore = useUsersStore();
  const lastUpdateDiff = differenceInSeconds(
    new Date(),
    new Date(user.lastUpdate)
  );
  const connectionStrength = 1 - lastUpdateDiff / DISCONNECT_AFTER;
  return {
    ...user,
    connectionStrength,
    isConnected: connectionStrength > 0,
    isCurrent: user.userId == usersStore.userId,
  };
}

export const useUsersStore = defineStore("users", {
  state: () =>
    ({
      userId: generateId(16),
      users: [],
      username: localStorage.getItem("username"),
      joinTime: null,
    } as UserState),
  actions: {
    init() {
      this.joinTime = new Date();
      this.intervalId = setInterval(() => this.heartbeat(), 3500);
      this.heartbeat();

      this.gunUsers.load!((state) => this.ingestUsers(state));

      this.gunUsers.open!((data) => {
        this.ingestUsers(data);
      });
    },
    ingestUsers(users: Record<string, StoredUser>) {
      this.users = Object.values(users)
        .map((user) => ingestUser(user))
        .sort((a, b) =>
          a.isCurrent
            ? -1
            : compareAsc(new Date(a.joinTime), new Date(b.joinTime))
        );
    },
    heartbeat() {
      this.gunUser.put(this.getCurrentBasicUser());
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
    gunUsers(): IGunChainReference<Record<string, StoredUser>, "users", false> {
      const roomStore = useRoomStore();
      return roomStore.gunRoom.get(`users`);
    },
    gunUser(): IGunChainReference<StoredUser, string, false> {
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

import { defineStore } from "pinia";
import { useRoomStore } from "@/store/room";
import { generateId } from "@/helpers/generate";
import { IGunChainReference } from "gun/types/chain";
import { differenceInSeconds } from "date-fns";
import { useGlobalStore } from "@/store/global";
import { StoredUser } from "@/helpers/database";

interface UserState {
  userId: string;
  users: User[];
  intervalId?: number;
  username: string | null;
}

export enum UserStatus {
  disconnected = 10,
  good = 4,
  medium = 6,
  bad = 8,
}

export interface User extends StoredUser {
  lastUpdateDiff: number;
  status: UserStatus;
  isCurrent: boolean;
}

function ingestUser(user: StoredUser): User {
  const usersStore = useUsersStore();
  const lastUpdateDiff = differenceInSeconds(
    new Date(),
    new Date(user.lastUpdate)
  );
  return {
    ...user,
    lastUpdateDiff,
    status:
      lastUpdateDiff > UserStatus.disconnected
        ? UserStatus.disconnected
        : lastUpdateDiff > UserStatus.bad
        ? UserStatus.bad
        : lastUpdateDiff > UserStatus.medium
        ? UserStatus.medium
        : UserStatus.good,
    isCurrent: user.userId == usersStore.userId,
  };
}

export const useUsersStore = defineStore("users", {
  state: () =>
    ({
      userId: generateId(16),
      users: [],
      username: localStorage.getItem("username"),
    } as UserState),
  actions: {
    init() {
      this.intervalId = setInterval(() => this.heartbeat(), 3500);
      this.heartbeat();

      this.gunUsers.load!((state) => this.ingestUsers(state));

      this.gunUsers.open!((data) => {
        this.ingestUsers(data);
        // console.log("Update users", this.activeUsers, this.users);
      });
    },
    ingestUsers(users: Record<string, StoredUser>) {
      this.users = Object.values(users).map((user) => ingestUser(user));
    },
    heartbeat() {
      this.gunUser.put(this.currentBasicUser);
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
    gunUsers(): IGunChainReference {
      const roomStore = useRoomStore();
      return roomStore.gunRoom.get(`users`);
    },
    gunUser(): IGunChainReference {
      return this.gunUsers.get(this.userId);
    },
    activeUsers(): User[] {
      return [
        this.currentUser,
        ...this.users.filter((user) => {
          return !user.isCurrent && user.status != UserStatus.disconnected;
        }),
      ];
    },
    allLoaded(): boolean {
      const roomStore = useRoomStore();
      return this.activeUsers.every(
        (user) => user.loaded == roomStore.currentItemId
      );
    },
    currentBasicUser(): StoredUser {
      return {
        lastUpdate: new Date().toString(),
        username: this.username,
        hasExtension: useGlobalStore().hasExtension,
        userId: this.userId,
      };
    },
    currentUser(): User {
      return ingestUser(this.currentBasicUser);
    },
  },
});

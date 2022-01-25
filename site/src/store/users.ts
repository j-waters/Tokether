import { defineStore } from "pinia";
import { PlaylistItem, useRoomStore } from "@/store/room";
import { generateId } from "@/helpers/generate";
import { IGunChainReference } from "gun/types/chain";
import { differenceInSeconds } from "date-fns";

interface UserState {
  userId: string;
  users: User[];
  intervalId?: number;
}

export interface User {
  lastUpdate: string;
  loaded?: string;
  name: string;
}

export const useUsersStore = defineStore("users", {
  state: () =>
    ({
      userId: generateId(16),
      users: [],
    } as UserState),
  actions: {
    init() {
      this.intervalId = setInterval(() => this.heartbeat(), 3500);
      this.heartbeat();
      this.gunUsers.open!((data) => {
        this.users = Object.values(data);
      });
    },
    heartbeat() {
      this.gunUser.put({
        lastUpdate: new Date().toString(),
        name: `User${this.userId}`,
      });
    },
    setLoaded(videoId: string) {
      this.gunUser.put({ loaded: videoId });
    },
    leave() {
      clearInterval(this.intervalId);
      this.gunUsers.off();
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
      return this.users.filter((user) => {
        return differenceInSeconds(new Date(), new Date(user.lastUpdate)) < 10;
      });
    },
    allLoaded(): boolean {
      const roomStore = useRoomStore();
      return this.activeUsers.every(
        (user) => user.loaded == roomStore.currentVideoId
      );
    },
  },
});

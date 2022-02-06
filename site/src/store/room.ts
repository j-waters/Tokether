import { defineStore } from "pinia";
import {
  BasicVideoInfo,
  extractBasicInfo,
  getVideoInfo,
} from "@tokether/common";
import {
  db,
  StoredPlaylistItem,
  StoredRoomRoot,
  StoredRoomState,
} from "@/helpers/database";
import router from "@/router";
import { IGunChainReference } from "gun/types/chain";
import { usePlayerStore } from "@/store/player";
import { generateId } from "@/helpers/generate";
import { useUsersStore } from "@/store/users";
import { PlaylistItem, usePlaylistStore } from "@/store/playlist";

function isEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}

interface RoomState extends StoredRoomState {
  roomId: string | null;
  rawPlaylist: Record<string, StoredPlaylistItem>;
}

export const useRoomStore = defineStore("room", {
  state: () =>
    ({
      roomId: null,
      currentItemId: undefined,
    } as RoomState),
  actions: {
    async leave() {
      this.gunRoom.off();
      this.$reset();
      usePlayerStore().leave();
      useUsersStore().leave();
      usePlaylistStore().leave();
    },
    init() {
      const playlistStore = usePlaylistStore();
      const playerStore = usePlayerStore();
      const usersStore = useUsersStore();

      playlistStore.init();
      playerStore.init();
      usersStore.init();

      return { playlistStore, playerStore, usersStore };
    },

    async createRoom() {
      this.roomId = generateId(4);
      const { playlistStore } = this.init();

      playlistStore.addVideos([
        "https://www.tiktok.com/@ellie.rawlings/video/7057230662700502277",
        "https://www.tiktok.com/@mitsy270/video/7060712287082089774",
        "https://www.tiktok.com/@velasquezriley/video/7060991838697721134",
      ]);

      this.setPlaylistItem(undefined);

      await router.push({ name: "Room", params: { id: this.roomId } });
    },

    async setPlaylistItem(itemId: string | undefined) {
      this.gunRoomState.put({ currentItemId: itemId });
    },

    async navigatePlaylist(change: number) {
      const playlist = usePlaylistStore().playlist;
      const nextItem = playlist[this.playlistIndex + change];
      if (nextItem) {
        this.setPlaylistItem(nextItem.itemId);
      }
    },

    async setInitialPlaylistItem() {
      if (this.currentItemId == undefined) {
        const playlistStore = usePlaylistStore();
        const firstPlaylistItem = playlistStore.playlist[0];
        if (firstPlaylistItem) {
          this.gunRoomState.put({
            currentItemId: firstPlaylistItem.itemId,
          });
        }
      }
    },

    async ingestState(state: StoredRoomState) {
      console.log("ingest state", state);
      const prevItemId = this.currentItemId;
      this.currentItemId = state.currentItemId;
      if (this.currentItemId != prevItemId) {
        const playerStore = usePlayerStore();
        playerStore.changedVideo(this.currentItem);
      }
    },

    async loadRoom(roomId: string) {
      this.roomId = roomId;

      this.init();

      this.gunRoomState.load!((state) => this.ingestState(state));
      this.gunRoomState.open!((state) => {
        this.ingestState(state);
      });
    },
  },
  getters: {
    currentItem(): PlaylistItem | null {
      if (this.currentItemId == null) return null;
      return usePlaylistStore().playlistMap.get(this.currentItemId) ?? null;
    },
    gunRoom(): IGunChainReference<StoredRoomRoot, string, false> {
      return db.get("rooms").get(this.roomId!);
    },
    gunRoomState(): IGunChainReference<StoredRoomState, "state", false> {
      return this.gunRoom.get("state");
    },
    playlistIndex(): number {
      return this.currentItem?.index ?? -1;
    },
  },
});

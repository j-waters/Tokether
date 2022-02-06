import { defineStore } from "pinia";
import { getVideoInfo, TikTokVideo } from "@tokether/common";
import { db } from "@/helpers/database";
import router from "@/router";
import { IGunChainReference } from "gun/types/chain";
import { usePlayerStore } from "@/store/player";
import { generateId } from "@/helpers/generate";
import { useUsersStore } from "@/store/users";

function isEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}

export interface PlaylistItem {
  video: TikTokVideo;
}

export interface EnhancedPlaylistItem extends PlaylistItem {
  index: number;
  isCurrent: boolean;
  videoId: string;
  itemId: string;
}

interface RoomSharedState {
  playlist: PlaylistItem[];
  playlistIndex: number;
}

interface RoomState extends RoomSharedState {
  roomId: string | null;
}

export const useRoomStore = defineStore("room", {
  state: () =>
    ({
      playlist: [] as PlaylistItem[],
      roomId: null,
      playlistIndex: 0,
    } as RoomState),
  actions: {
    async leave() {
      this.gunRoom.off();
      this.$reset();
      usePlayerStore().leave();
      useUsersStore().leave();
    },
    async addVideos(urls: string[]) {
      const playlist = this.gunRoomState.get("playlist");
      for (const url of urls) {
        if (url == "") continue;
        const info = await getVideoInfo(url);
        console.log("add video", url);
        playlist.set({
          video: info,
        } as PlaylistItem);
      }
    },
    async addVideo(url: string) {
      this.addVideos([url]);
    },
    async createRoom() {
      this.roomId = generateId(4);

      this.setPlaylistIndex(0);
      await router.push({ name: "Room", params: { id: this.roomId } });
    },

    async setPlaylistIndex(playlistIndex: number) {
      if (playlistIndex >= this.playlist.length) {
        playlistIndex = this.playlist.length - 1;
      }
      if (playlistIndex < 0) {
        playlistIndex = 0;
      }
      this.gunRoomState.put({ playlistIndex });
    },

    async nextVideo() {
      this.setPlaylistIndex(this.playlistIndex + 1);
    },
    async prevVideo() {
      this.setPlaylistIndex(this.playlistIndex - 1);
    },

    async ingestState(state: RoomSharedState) {
      const currentVideoId = this.currentVideo?.videoId;
      const currentPlaylistIndex = this.playlistIndex;
      this.playlist = Object.values(state.playlist ?? {});
      this.playlistIndex = state.playlistIndex;
      if (
        this.currentVideo &&
        (this.currentVideo.videoId != currentVideoId ||
          this.playlistIndex != currentPlaylistIndex)
      ) {
        const playerStore = usePlayerStore();
        playerStore.changedVideo(this.currentVideo.videoId);
      }
    },

    async loadRoom(roomId: string) {
      this.roomId = roomId;

      const userStore = useUsersStore();
      userStore.init();

      this.gunRoomState.load!((state) =>
        this.ingestState(state as RoomSharedState)
      );

      this.gunRoomState.open!((state) => {
        this.ingestState(state as RoomSharedState);
      });
    },
  },
  getters: {
    currentVideo(): TikTokVideo | null {
      return this.playlist[this.playlistIndex]?.video;
    },
    currentVideoId(): string | null {
      return this.currentVideo?.videoId ?? null;
    },
    enhancedPlaylist(): EnhancedPlaylistItem[] {
      return this.playlist
        .filter((item) => !isEmpty(item))
        .map((item, index) => {
          return {
            ...item,
            index,
            isCurrent: index == this.playlistIndex,
            videoId: item.video.videoId,
            itemId: `${index}|${item.video.videoId}`,
          };
        });
    },
    loadedVideos(): EnhancedPlaylistItem[] {
      return [
        this.playlistIndex - 1,
        this.playlistIndex,
        this.playlistIndex + 1,
        this.playlistIndex + 2,
      ]
        .map((index) => this.enhancedPlaylist[index])
        .filter((value) => value && value.videoId);
    },
    gunRoom(): IGunChainReference {
      return db.get(`rooms/${this.roomId}`);
    },
    gunRoomState(): IGunChainReference {
      return this.gunRoom.get("state");
    },
  },
});

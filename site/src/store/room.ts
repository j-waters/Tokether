import { defineStore } from "pinia";
import { getVideoInfo, TikTokVideo } from "@tokether/common";
import { db } from "@/helpers/database";
import router from "@/router";
import { IGunChainReference } from "gun/types/chain";

function generateId(len: number): string {
  const arr = new Uint8Array(len / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
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

interface RoomState {
  playlist: PlaylistItem[];
  roomId: string | null;
  playlistIndex: number;
}

export const useRoomStore = defineStore("room", {
  state: () =>
    ({
      playlist: [] as PlaylistItem[],
      roomId: null,
      playlistIndex: 0,
    } as RoomState),
  actions: {
    async addVideos(urls: string[]) {
      const playlist = this.gunRoom.get("playlist");
      for (const url of urls) {
        if (url == "") continue;
        const info = await getVideoInfo(url);
        playlist.set({
          video: info,
        } as PlaylistItem);
      }
    },
    async addVideo(url: string) {
      this.addVideos([url]);
    },
    async createRoom() {
      this.roomId = generateId(8);
      this.addVideo(
        "https://www.tiktok.com/@caenerys_/video/7024976493956615429"
      );
      this.addVideo(
        "https://www.tiktok.com/@paigeonapage/video/7056126736802745647?sender_device=mobile&sender_web_id=7023423328941934086&is_from_webapp=v1&is_copy_url=0"
      );
      this.setPlaylistIndex(0);
      await router.push({ name: "Room", params: { id: this.roomId } });
    },

    async setPlaylistIndex(playlistIndex: number) {
      if (playlistIndex >= this.playlist.length) {
        playlistIndex = this.playlist.length - 1;
      } else if (playlistIndex < 0) {
        playlistIndex = 0;
      }
      this.gunRoom.put({ playlistIndex });
    },

    async nextVideo() {
      this.setPlaylistIndex(this.playlistIndex + 1);
    },
    async prevVideo() {
      this.setPlaylistIndex(this.playlistIndex - 1);
    },

    async loadRoom(roomId: string) {
      this.roomId = roomId;
      const room = db.get(`rooms/${roomId}`);
      room.open!((data) => {
        this.playlist = Object.values(data.playlist);
        this.playlistIndex = data.playlistIndex;
      });
    },
  },
  getters: {
    currentVideo(): TikTokVideo | null {
      return this.playlist[this.playlistIndex]?.video;
    },
    enhancedPlaylist(): EnhancedPlaylistItem[] {
      return this.playlist.map((item, index) => ({
        ...item,
        index,
        isCurrent: index == this.playlistIndex,
        videoId: item.video.videoId,
        itemId: `${index}|${item.video.videoId}`,
      }));
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
  },
});

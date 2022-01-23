import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { getVideoInfo, TikTokVideo } from "@/helpers/tiktok";
import { db } from "@/helpers/database";
import router from "@/router";

function generateId(len: number): string {
  const arr = new Uint8Array(len / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
}

export interface PlaylistItem {
  video: TikTokVideo;
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
    async addVideo(url: string) {
      const info = await getVideoInfo(url);
      db.get(`rooms/${this.roomId}`)
        .get("playlist")
        .set({
          video: info,
        } as PlaylistItem);
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
      db.get(`rooms/${this.roomId}`).put({ playlistIndex });
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
        console.log("!!!!", data);
        this.playlistIndex = data.playlistIndex;
      });
    },
  },
  getters: {
    currentVideo(): TikTokVideo | null {
      return this.playlist[this.playlistIndex]?.video;
    },
  },
});

import { defineStore } from "pinia";
import { useRoomStore } from "@/store/room";
import { StoredPlaylistItem } from "@/helpers/database";
import { IGunChainReference } from "gun/types/chain";
import {
  BasicVideoInfo,
  extractBasicInfo,
  getVideoInfo,
} from "@tokether/common";
import { reactive } from "vue";

export interface PlaylistItem extends StoredPlaylistItem, BasicVideoInfo {
  index: number;
  itemId: string;
}

export function isCurrent(item: PlaylistItem) {
  return item.itemId == useRoomStore().currentItemId;
}

export const usePlaylistStore = defineStore("playlist", {
  state() {
    return {
      playlist: [] as PlaylistItem[],
    };
  },
  actions: {
    init() {
      this.gunPlaylist.load!(this.ingestPlaylist);
      this.gunPlaylist.open!(this.ingestPlaylist);
    },
    ingestPlaylist(storedPlaylist: Record<string, StoredPlaylistItem>) {
      this.playlist = Object.entries(storedPlaylist)
        .filter(([, item]) => item.url)
        .map(([itemId, item], index) => ({
          ...item,
          ...extractBasicInfo(item.url),
          itemId,
          index,
        }));
      useRoomStore().setInitialPlaylistItem();
    },
    leave() {
      this.gunPlaylist.off();
      this.$reset();
    },
    async addVideos(urls: string[]) {
      for (const url of urls) {
        this.addVideo(url);
      }
    },
    async addVideo(url: string) {
      if (url == "") return;
      const info = await getVideoInfo(url);
      const playlistItem: StoredPlaylistItem = {
        fullInfo: info,
        url,
      };
      this.gunPlaylist.set(playlistItem);
    },
  },
  getters: {
    playlistMap(): Map<string, PlaylistItem> {
      return new Map(this.playlist.map((item) => [item.itemId, item]));
    },
    gunPlaylist(): IGunChainReference<
      Record<string, StoredPlaylistItem>,
      "playlist",
      false
    > {
      const roomStore = useRoomStore();
      return roomStore.gunRoom.get("playlist");
    },
  },
});

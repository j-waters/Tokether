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
  userId: string;
}

export const useRoomStore = defineStore("room", {
  state: () =>
    ({
      playlist: [] as PlaylistItem[],
      roomId: null,
      playlistIndex: 0,
      userId: generateId(32),
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
      this.roomId = generateId(8);
      this.addVideos([
        "https://www.tiktok.com/@hardlyhardin/video/7051714436142255366",
        "https://www.tiktok.com/@aketton/video/7053481619449040134",
        "https://www.tiktok.com/@asimpforspidey/video/7050803584744688902",
        "https://www.tiktok.com/@obabydriver/video/7052865133931990319",
        "https://www.tiktok.com/@nityasweater/video/7052792237683510533",
        "https://www.tiktok.com/@swamp_ghoul/video/7053087726479953158",
        "https://www.tiktok.com/@mhall.22/video/7052738837570751791",
        "https://www.tiktok.com/@rileslovesyall/video/7052447375910079790",
        "https://www.tiktok.com/@jack.lawro/video/7052784473284300037",
        "https://www.tiktok.com/@becauseimmissy_/video/7052747526042111238",
        "https://www.tiktok.com/@deathpr0cess/video/7052745014476311855",
        "https://www.tiktok.com/@jamezlaskey/video/7051587577136172293",
        "https://www.tiktok.com/@hardlyhardin/video/7051713121609649413",
        "https://www.tiktok.com/@benlapidus/video/7051764182508916014",
        "https://www.tiktok.com/@futuremilfclub/video/7047313072721022254",
        "https://www.tiktok.com/@ctrl.alt.mdlt/video/7051785107224694063",
        "https://www.tiktok.com/@carlygarberlolk/video/7045780237828967727",
        "https://www.tiktok.com/@mrelectricnick/video/7025423947894148353",
        "https://www.tiktok.com/@kkirstylouise/video/7050943365084499205",
        "https://www.tiktok.com/@lenslibrary/video/7043031245722275119",
        "https://www.tiktok.com/@sadiewooster/video/7050447220239387910",
      ]);

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

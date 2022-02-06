import { defineStore } from "pinia";
import { useRoomStore } from "@/store/room";
import { IGunChainReference } from "gun/types/chain";
import { useUsersStore } from "@/store/users";
import { useGlobalStore } from "@/store/global";
import { waitForTrue } from "@/helpers/watchers";
import { messageAllowedFromTikTok } from "@/helpers/messaging";
import { PlaylistItem, usePlaylistStore } from "@/store/playlist";

interface PlayerState {
  playing: boolean;
  loaded: string[];
  autoplayEnabled: boolean;
}

export const usePlayerStore = defineStore("player", {
  state: () =>
    ({
      playing: false,
      loaded: [],
      autoplayEnabled: false,
    } as PlayerState),
  actions: {
    init() {
      window.addEventListener("message", this.onMessage, false);

      this.gunPlayer.open!((data) => {
        this.playing = data.playing;
        this.setIframePlaying(this.playing);
      });
    },
    onMessage(event: MessageEvent) {
      if (!messageAllowedFromTikTok(event)) {
        return;
      }

      switch (event.data.type) {
        case "loaded":
          this.loaded.push(event.data.videoId);
          break;
        case "embedSetPlaying":
          this.setPlaying(event.data.playing);
          break;
      }
    },
    leave() {
      window.removeEventListener("message", this.onMessage);
      this.gunPlayer.off();
      this.$reset();
    },
    setIframePlaying(playing: boolean, iframe?: HTMLIFrameElement | null) {
      const globalStore = useGlobalStore();
      if (!globalStore.hasInteracted) {
        return;
      }
      if (iframe == undefined) {
        iframe = document.querySelector(
          ".current-iframe iframe"
        ) as HTMLIFrameElement;
      }
      const iframeWindow: WindowProxy | null | undefined =
        iframe?.contentWindow;
      iframeWindow?.postMessage({ type: "parentSetPlaying", playing }, "*");
    },
    setAllIframesPlaying(playing: boolean) {
      document
        .querySelectorAll("iframe")
        .forEach((iframe) => this.setIframePlaying(playing, iframe));
    },
    setPlaying(playing: boolean) {
      this.autoplayEnabled = true;
      this.gunPlayer.put({ playing });
    },
    unloadVideoId(videoId: string) {
      this.loaded = this.loaded.filter((l) => l != videoId);
    },
    async changedVideo(currentItem: PlaylistItem | null) {
      this.setAllIframesPlaying(false);

      if (currentItem == null) return;

      const globalStore = useGlobalStore();

      await waitForTrue(
        () =>
          this.loaded.includes(currentItem.videoId) &&
          globalStore.hasInteracted &&
          this.autoplayEnabled
      );

      const usersStore = useUsersStore();
      usersStore.setLoaded(currentItem.itemId);

      await waitForTrue(() => usersStore.allLoaded);

      this.setPlaying(true);
    },
  },
  getters: {
    gunPlayer(): IGunChainReference {
      const roomStore = useRoomStore();
      return roomStore.gunRoom.get("player");
    },
    loadedVideos(): PlaylistItem[] {
      const playlistStore = usePlaylistStore();
      const playlistIndex = useRoomStore().playlistIndex;
      const loaded = [
        playlistIndex - 1,
        playlistIndex,
        playlistIndex + 1,
        playlistIndex + 2,
      ]
        .map((index) => playlistStore.playlist[index])
        .filter((value) => value && value.url);
      return loaded;
    },
  },
});

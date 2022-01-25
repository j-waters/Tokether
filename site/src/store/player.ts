import { defineStore } from "pinia";
import { useRoomStore } from "@/store/room";
import { IGunChainReference } from "gun/types/chain";
import { useUsersStore } from "@/store/users";
import { computed, watch } from "vue";
import { useGlobalStore } from "@/store/global";
import { waitForTrue } from "@/helpers/watchers";
import { messageAllowedFromTikTok } from "@/helpers/messaging";

interface PlayerState {
  playing: boolean;
  loaded: string[];
}

export const usePlayerStore = defineStore("player", {
  state: () =>
    ({
      playing: false,
      loaded: [],
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
      this.gunPlayer.put({ playing });
    },
    unloadVideoId(videoId: string) {
      this.loaded = this.loaded.filter((l) => l != videoId);
    },
    async changedVideo(videoId: string) {
      console.log("changed video");
      this.setAllIframesPlaying(false);

      const globalStore = useGlobalStore();

      await waitForTrue(
        () => this.loaded.includes(videoId) && globalStore.hasInteracted
      );

      const usersStore = useUsersStore();
      usersStore.setLoaded(videoId);

      await waitForTrue(() => usersStore.allLoaded);

      this.setPlaying(true);
    },
  },
  getters: {
    gunPlayer(): IGunChainReference {
      const roomStore = useRoomStore();
      return roomStore.gunRoom.get("player");
    },
  },
});

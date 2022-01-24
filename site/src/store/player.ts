import { defineStore } from "pinia";
import { useRoomStore } from "@/store/room";

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
      window.addEventListener(
        "message",
        (event) => {
          // We only accept messages from the tiktok window
          if (
            event.source == null ||
            !("parent" in event.source) ||
            event.source.parent != window ||
            event.origin != "https://www.tiktok.com"
          ) {
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
        false
      );

      this.gunPlayer.open!((data) => {
        this.playing = data.playing;

        const curIframe: HTMLIFrameElement | null = document.querySelector(
          ".current-iframe iframe"
        );
        const iframeWindow: WindowProxy | null | undefined =
          curIframe?.contentWindow;
        iframeWindow?.postMessage(
          { type: "parentSetPlaying", playing: this.playing },
          "*"
        );
      });
    },
    setPlaying(playing: boolean) {
      this.gunPlayer.put({ playing });
    },
  },
  getters: {
    gunPlayer() {
      const roomStore = useRoomStore();
      return roomStore.gunRoom.get("player");
    },
  },
});

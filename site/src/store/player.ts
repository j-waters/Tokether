import { defineStore } from "pinia";
import { useRoomStore } from "@/store/room";
import { IGunChainReference } from "gun/types/chain";
import { useUsersStore } from "@/store/users";
import { watch } from "vue";

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
              console.log("recv loaded", event.data.videoId);
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
        this.setIframePlaying(this.playing);
      });
    },
    setIframePlaying(playing: boolean) {
      const curIframe: HTMLIFrameElement | null = document.querySelector(
        ".current-iframe iframe"
      );
      const iframeWindow: WindowProxy | null | undefined =
        curIframe?.contentWindow;
      iframeWindow?.postMessage({ type: "parentSetPlaying", playing }, "*");
    },
    setAllIframesPlaying(playing: boolean) {
      document.querySelectorAll("iframe").forEach((iframe) =>
        iframe.contentWindow?.postMessage(
          {
            type: "parentSetPlaying",
            playing,
          },
          "*"
        )
      );
    },
    setPlaying(playing: boolean) {
      this.gunPlayer.put({ playing });
    },
    unloadVideoId(videoId: string) {
      this.loaded = this.loaded.filter((l) => l != videoId);
    },
    changedVideo(videoId: string) {
      console.log("changed video");
      this.setAllIframesPlaying(false);

      const _whenLoaded = () => {
        console.log("video is loaded");
        const usersStore = useUsersStore();
        usersStore.setLoaded(videoId);
        if (usersStore.allLoaded) {
          this.setPlaying(true);
        } else {
          const stopWatchingUsers = watch(
            () => usersStore.allLoaded,
            (allUsersLoaded) => {
              if (allUsersLoaded) {
                this.setPlaying(true);
                stopWatchingUsers();
              }
            }
          );
        }
      };

      if (this.loaded.includes(videoId)) {
        console.log("already loaded");
        _whenLoaded();
      } else {
        console.log("not loaded");
        const stopWatchingLoaded = watch(
          () => this.loaded.includes(videoId),
          (loadedIncludesId) => {
            if (loadedIncludesId) {
              _whenLoaded();
            }
            stopWatchingLoaded();
          }
        );
      }
    },
  },
  getters: {
    gunPlayer(): IGunChainReference {
      const roomStore = useRoomStore();
      return roomStore.gunRoom.get("player");
    },
  },
});

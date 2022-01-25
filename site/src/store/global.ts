import { defineStore } from "pinia";
import { messagedAllowedFromWindow } from "@/helpers/messaging";

interface GlobalState {
  hasInteracted: boolean;
  hasExtension: boolean;
}

const INTERACTION_EVENTS: (keyof WindowEventMap)[] = ["scroll", "click"];

const EXTENSION_ID = "lphfloofohjpcjokijgimadbllfckcjb";

export const useGlobalStore = defineStore("global", {
  state: () =>
    ({
      hasInteracted: false,
      hasExtension: false,
    } as GlobalState),
  actions: {
    init() {
      INTERACTION_EVENTS.forEach((event) =>
        window.addEventListener(event, this.onInteraction)
      );
      chrome.runtime.sendMessage(EXTENSION_ID, { type: "version" }, () => {
        this.hasExtension = chrome.runtime.lastError == undefined;
      });
    },
    onInteraction() {
      this.hasInteracted = true;
      INTERACTION_EVENTS.forEach((event) =>
        window.removeEventListener(event, this.onInteraction)
      );
    },
  },
});

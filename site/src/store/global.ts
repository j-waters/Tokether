import { defineStore } from "pinia";
import { messagedAllowedFromWindow } from "@/helpers/messaging";

interface GlobalState {
  hasInteracted: boolean;
  hasExtension: boolean;
}

const INTERACTION_EVENTS: (keyof WindowEventMap)[] = ["scroll", "click"];

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
      window.addEventListener("message", this.onMessage, false);
    },
    onInteraction() {
      this.hasInteracted = true;
      INTERACTION_EVENTS.forEach((event) =>
        window.removeEventListener(event, this.onInteraction)
      );
    },
    onMessage(event: MessageEvent) {
      if (!messagedAllowedFromWindow(event)) {
        return;
      }

      switch (event.data.type) {
        case "hasExtension":
          console.log("has extension");
          this.hasExtension = true;
          break;
      }
    },
  },
});

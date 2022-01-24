import { getVideoId } from "@tokether/common/lib/tiktok";

const videoId = getVideoId(location.href);

console.log("embed mode");

function getPlayBtn(): HTMLDivElement | null {
  return document.querySelector(".playBtn");
}

function getCover(): HTMLDivElement | null {
  return document.querySelector(".coverBox");
}

function getLoader(): HTMLDivElement | null {
  return document.querySelector(".loader");
}

const interval = setInterval(() => {
  const el = getCover();

  el?.addEventListener("click", () => {
    window.parent.postMessage(
      { type: "embedSetPlaying", playing: getPlayBtn() != null },
      "*"
    );
  });

  clearInterval(interval);
  window.parent.postMessage({ type: "loaded", videoId }, "*");
}, 200);

window.addEventListener(
  "message",
  (event) => {
    // We only accept messages from the parent window
    if (event.source == null || event.source != window.parent) {
      return;
    }

    switch (event.data.type) {
      case "parentSetPlaying":
        if (getLoader()) {
          console.log("not clicking");
        } else if (event.data.playing) {
          if (getPlayBtn() != null) {
            getCover()?.click();
          }
        } else if (getPlayBtn() == null) {
          getCover()?.click();
        }
        break;
    }
  },
  false
);

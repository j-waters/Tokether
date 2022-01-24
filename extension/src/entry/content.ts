import {
  ExtensionState,
  ScrapedVideo,
  ScrapedVideoUrl,
} from "@tokether/common/lib/types";

const state: ExtensionState = {
  messagesScraping: false,
  likedScraping: false,
};

function getAllVideos(): ScrapedVideoUrl[] {
  const links = [...document.querySelectorAll("a")]
    .map((link): ScrapedVideoUrl => ({ url: link.href, source: "liked" }))
    .filter((l) => l.url.match(/https:\/\/www\.tiktok\.com\/.+\/video\/\d+/));
  return links;
}

function sendToBackend(videos: ScrapedVideo[]) {
  chrome.runtime.sendMessage({ type: "sendVideos", videos });
}

function scrape() {
  sendToBackend(getAllVideos());
}

chrome.runtime.sendMessage(
  { type: "getState" },
  (response: ExtensionState[]) => {
    Object.assign(state, response);
  }
);

document.addEventListener("scroll", () => {
  if (state.likedScraping) {
    scrape();
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "scrape":
      scrape();
      break;
    case "setState":
      Object.assign(state, message);
      sendResponse(state);
      if (state.likedScraping) {
        scrape();
      }
      break;
  }
});

getAllVideos();

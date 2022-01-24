import {
  getUrlFromId,
  ScrapedVideo,
  BasicVideoInfo,
  extractBasicInfo,
  BasicVideoInfoSourced,
  ExtensionState,
} from "@tokether/common";

const videos: BasicVideoInfoSourced[] = [];

const state: ExtensionState = {
  messagesScraping: false,
  likedScraping: false,
};

chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (!state.messagesScraping) return;

    const videoId = (details.url.match(/itemId=(\d*)/) ?? [])[1];
    ingestVideos([{ videoId, source: "messages" }]);
  },
  { urls: ["*://*.tiktok.com/api/im/item_detail/*"] }
);

async function ingestVideos(newVideos: ScrapedVideo[]) {
  for (const video of newVideos) {
    const url = "url" in video ? video.url : await getUrlFromId(video.videoId);
    if (url && videos.find((v) => v.url === url) == null)
      videos.push({ ...extractBasicInfo(url), source: video.source });
  }
  chrome.runtime.sendMessage({ type: "updateVideos", videos });
}

function updateState(newState: Partial<ExtensionState>) {
  Object.assign(state, newState);
  chrome.tabs.query({}, (tabs) =>
    tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id!, state))
  );
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "sendVideos":
      ingestVideos(message.videos);
      break;
    case "getVideos":
      sendResponse(videos);
      break;
    case "getState":
      sendResponse(state);
      break;
    case "setState":
      updateState(message);
      sendResponse(state);
      break;
    case "clear":
      videos.splice(
        0,
        videos.length,
        ...videos.filter((v) => v.source != message.source)
      );
      chrome.runtime.sendMessage({ type: "updateVideos", videos });
      break;
    // case "bounce":
    //   chrome.tabs.sendMessage(sender.tab!.id!, message.message);
    //   break;
  }
});

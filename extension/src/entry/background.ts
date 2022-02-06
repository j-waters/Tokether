import {
  getUrlFromId,
  ScrapedVideo,
  extractBasicInfo,
  BasicVideoInfoSourced,
  ExtensionState,
  ScrapedVideoUrl,
  http,
} from "@tokether/common";
import { DEFAULT_STATE } from "@tokether/common/lib/types";
import state from "@/helpers/state";
import {ingestVideos} from "@/helpers/ingestVideos";

chrome.webRequest.onCompleted.addListener(
  async function (details) {
    if (!(await state.messagesScraping)) return;

    const videoId = (details.url.match(/itemId=(\d*)/) ?? [])[1];
    await ingestVideos([{ videoId, source: "messages" }]);
  },
  { urls: ["*://*.tiktok.com/api/im/item_detail/*"] }
);

chrome.runtime.onMessageExternal.addListener(function (
  message,
  sender,
  sendResponse
) {
  switch (message.type) {
    case "version":
      sendResponse({ version: 1.0 });
      break;
  }
  return true;
});

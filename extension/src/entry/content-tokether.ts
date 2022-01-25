console.log("tokether mode");
window.postMessage({ type: "hasExtension" }, "*");
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // switch (message.type) {
  //   case "loaded":
  //     console.log("got loaded!!");
  //     window.postMessage({ type: "loaded", videoId: message.videoId }, "*");
  //     break;
  // }
});

console.log("background", chrome.webRequest.onCompleted.addListener);
chrome.webRequest.onCompleted.addListener(
  function (details) {
    const videoId = (details.url.match(/itemId=(\d*)/) ?? [])[1];
    return console.log("detailsL", details, details.responseHeaders);
  },
  { urls: ["*://*.tiktok.com/api/im/item_detail/*"] }
);

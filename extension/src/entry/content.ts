function getAllVideos() {
  const links = [...document.querySelectorAll("a")]
    .map((link) => link.href)
    .filter((l) => l.match(/https:\/\/www\.tiktok\.com\/.+\/video\/\d+/));
  console.log(links);
  return links;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "scrape":
      sendResponse(getAllVideos());
      break;
  }
});

getAllVideos();

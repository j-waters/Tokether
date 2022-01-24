console.log("tokether mode");
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "loaded":
      console.log("got loaded!!");
      break;
  }
});

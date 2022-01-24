console.log("embed mode");
const interval = setInterval(() => {
  const el: HTMLDivElement | null = document.querySelector(".coverBox");
  el?.addEventListener("click", () => console.log("click"));
  clearInterval(interval);
  console.log("sending loaded");
  chrome.runtime.sendMessage({ type: "bounce", message: { type: "loaded" } });
}, 1000);

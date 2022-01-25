export function messageAllowedFromTikTok(event: MessageEvent) {
  return (
    event.source != null &&
    "parent" in event.source &&
    event.source.parent == window &&
    event.origin == "https://www.tiktok.com"
  );
}

export function messagedAllowedFromWindow(event: MessageEvent) {
  return event.source == window;
}

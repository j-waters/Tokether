export type VideoSource = "messages" | "liked";

export type BasicVideoInfo = {
  url: string;
  videoId: string;
  author: string;
};

export type BasicVideoInfoSourced = BasicVideoInfo & { source: VideoSource };

interface ScrapedVideoBase {
  source: VideoSource;
}

export interface ScrapedVideoUrl extends ScrapedVideoBase {
  url: string;
}

export interface ScrapedVideoId extends ScrapedVideoBase {
  videoId: string;
}
export type ScrapedVideo = ScrapedVideoUrl | ScrapedVideoId;

export interface ExtensionState {
  messagesScraping: boolean;
  likedScraping: boolean;
  videos: ScrapedVideoUrl[];
}

export const DEFAULT_STATE: ExtensionState = {
  messagesScraping: false,
  likedScraping: false,
  videos: [],
};

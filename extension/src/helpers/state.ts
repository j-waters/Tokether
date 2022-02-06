import { ExtensionState, ScrapedVideoUrl } from "@tokether/common";
import { Bucket } from "@extend-chrome/storage";
import { getBucket } from "@extend-chrome/storage";
import {Observable} from "rxjs";

type Promisified<T> = {
  [P in keyof T]: Promise<T[P]>;
};

class State implements Promisified<ExtensionState> {
  private storage: Bucket<ExtensionState>;

  constructor() {
    this.storage = getBucket<ExtensionState>("state");
  }

  async get<K extends keyof ExtensionState>(
    key: K,
    defaultValue: ExtensionState[K]
  ): Promise<ExtensionState[K]> {
    return await this.storage.get((obj) => obj[key] ?? defaultValue);
  }
  async set(obj: Partial<ExtensionState>) {
      return await this.storage.set(obj)
  }

  get messagesScraping() {
    return this.get("messagesScraping", false);
  }

  get likedScraping() {
    return this.get("likedScraping", false);
  }

  get videos() {
    return this.get("videos", []);
  }

  async addVideos(...newVideos: ScrapedVideoUrl[]) {
    return await this.storage.set((obj) => {
        const currentVideos = obj.videos ?? [];
        newVideos = newVideos.filter(newVideo => currentVideos.find(existingVideo => existingVideo.url == newVideo.url) == undefined)
      return { videos: [...currentVideos, ...newVideos] };
    });
  }

  async filterVideos<T>(predicate: (value: ScrapedVideoUrl, index: number, array: ScrapedVideoUrl[]) => boolean) {
      return await this.storage.set((obj) => {
          const currentVideos = obj.videos ?? [];
          return {videos: currentVideos.filter(predicate)}
      })
  }

  async json(): Promise<ExtensionState> {
    return {
      videos: await this.videos,
      messagesScraping: await this.messagesScraping,
      likedScraping: await this.likedScraping,
    };
  }

  get valueStream() {
      return this.storage.valueStream
  }
}

export default new State();

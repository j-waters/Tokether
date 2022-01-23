import axios from "axios";

interface TikTokResponse {
  version: string;
  type: string;
  title: string;
  author_url: string;
  author_name: string;
  width: string;
  height: string;
  html: string;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_url: string;
  provider_url: string;
  provider_name: string;
}

export interface TikTokVideo extends TikTokResponse {
  videoId: string;
}

export async function getVideoInfo(url: string) {
  const response = await axios.get<TikTokResponse>(
    `https://www.tiktok.com/oembed?url=${url}`
  );
  const videoId = url.match(/video\/(\d*)/)![1];
  return { ...response.data, videoId };
}

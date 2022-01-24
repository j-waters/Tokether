import { http } from "./http";
import { BasicVideoInfo } from "./types";

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
  const response = await http<TikTokResponse>(
    `https://www.tiktok.com/oembed?url=${url}`
  );
  return { ...response.parsedBody, videoId: getVideoId(url) };
}

export function getVideoId(url: string) {
  return url.match(/(?:video|embed)\/(\d*)/)![1];
}

export function getVideoAuthor(url: string) {
  const regex = new RegExp(`/(@[a-zA-z0-9_.]+)/video/\\d+`);
  console.log("getting author", url, url.match(regex));
  return url.match(regex)![1];
}

export function getEmbedUrl(videoId: string) {
  return `https://www.tiktok.com/embed/${videoId}`;
}

export async function getUrlFromId(videoId: string) {
  const response = await http(getEmbedUrl(videoId));
  const html = await response.text();
  const regex = new RegExp(`/(@[a-zA-z0-9_.]+)/video/${videoId}`);
  const match = html.match(regex);
  if (match == null) return null;
  return `https://www.tiktok.com${match[0]}`;
}

export function extractBasicInfo(url: string): BasicVideoInfo {
  return {
    url,
    author: getVideoAuthor(url),
    videoId: getVideoId(url),
  };
}

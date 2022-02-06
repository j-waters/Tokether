import {extractBasicInfo, getUrlFromId, ScrapedVideo} from "@tokether/common";
import state from "@/helpers/state";

export async function ingestVideos(newVideos: ScrapedVideo[]) {
    for (const video of newVideos) {
        const url = "url" in video ? video.url : await getUrlFromId(video.videoId);
        if (url) {
            await state.addVideos({ ...extractBasicInfo(url), source: video.source });
        }
    }
}

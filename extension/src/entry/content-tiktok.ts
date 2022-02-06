import {
  ExtensionState,
  ScrapedVideo,
  ScrapedVideoUrl,
} from "@tokether/common";
import {DEFAULT_STATE} from "@tokether/common/lib/types";
import state from "@/helpers/state";
import {distinctUntilKeyChanged} from "rxjs/operators";
import {ingestVideos} from "@/helpers/ingestVideos";

console.log("tiktok mode");

async function scrape() {
    if (await state.likedScraping) {
        const videos = [...document.querySelectorAll("a")]
            .map((link): ScrapedVideoUrl => ({ url: link.href, source: "liked" }))
            .filter((l) => l.url.match(/https:\/\/www\.tiktok\.com\/.+\/video\/\d+/));

        await ingestVideos(videos)
    }
}

document.addEventListener("scroll", () => {
    scrape()
});

state.valueStream.pipe(distinctUntilKeyChanged("likedScraping")).subscribe(() => {
    scrape()
})

scrape()

<template>
  <div
    class="popup is-flex is-align-items-center is-flex-direction-column has-text-centered p-4"
  >
    <h1 class="title is-5">Welcome to the Tokether extension!</h1>
    <p class="subtitle is-6">
      Use this extension to generate a list of TikToks to watch with someone
    </p>

    <div>
      <p class="heading">Liked video scraping</p>
      <div class="is-flex is-align-items-center has-text-left">
        <div class="">
          Go to your liked videos page in your profile and turn this on, then
          scroll down to load videos
        </div>
        <div class="">
          <ToggleButton state-key="likedScraping" v-model:state="state" />
        </div>
      </div>
      <VideoList :videos="videos" source="liked" />
    </div>

    <div class="mt-4">
      <p class="heading">Messages scraping</p>
      <div class="is-flex is-align-items-center has-text-left">
        <div class="">
          Go to
          <a @click="openMessagesPage()">your messages page</a>, turn this on,
          then open a chat. Scroll through the chat to load videos
        </div>
        <div class="">
          <ToggleButton state-key="messagesScraping" v-model:state="state" />
        </div>
      </div>
      <VideoList :videos="videos" source="messages" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { BasicVideoInfo, ExtensionState } from "@tokether/common";
import { BasicVideoInfoSourced } from "@tokether/common/lib/types";
import VideoList from "@/components/VideoList.vue";
import ToggleButton from "@/components/ToggleButton.vue";

const videos = ref<BasicVideoInfoSourced[]>([]);
const state = ref<ExtensionState>();

function scrape() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id!, { type: "scrape" });
  });
}

chrome.runtime.sendMessage(
  { type: "getVideos" },
  (response: BasicVideoInfo[]) => {
    videos.value = response;
  }
);

chrome.runtime.sendMessage(
  { type: "getState" },
  (response: ExtensionState[]) => {
    state.value = response;
  }
);

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "updateVideos":
      videos.value = message.videos;
      break;
  }
});

function openMessagesPage() {
  chrome.tabs.create({ url: "https://www.tiktok.com/messages?lang=en" });
}
</script>

<style lang="scss">
@import "~bulma";

body {
  min-width: 400px;
}
</style>

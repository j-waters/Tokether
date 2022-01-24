<template>
  <div class="mt-2" v-if="filteredVideos.length > 0">
    <div class="notification video-list has-text-left mb-0">
      <div v-for="video in filteredVideos" :key="video.videoId">
        <a @click="openUrl(video.url)">{{
          video.url.replace(/(https:\/\/)?\w+\.tiktok\.com\//, "")
        }}</a>
      </div>
    </div>
    <div class="buttons" style="width: 100%">
      <button class="button is-flex-grow-1" @click="clear()">Clear</button>
      <button class="button is-flex-grow-1" @click="copy()">Copy</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BasicVideoInfo, VideoSource } from "@tokether/common";
import { computed } from "vue";

const props = defineProps<{ videos: BasicVideoInfo[]; source: VideoSource }>();

const filteredVideos = computed(() =>
  props.videos.filter((v) => v.source === props.source)
);

function openUrl(url: string) {
  chrome.tabs.create({ url });
}

function copy() {
  navigator.clipboard.writeText(
    filteredVideos.value.map((v) => v.url).join("\n")
  );
}

function clear() {
  chrome.runtime.sendMessage({ type: "clear", source: props.source });
}
</script>

<style lang="scss" scoped>
.video-list {
  max-height: 100px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.table {
  table-layout: fixed;

  td {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>

<template>
  <div class="box is-fh is-flex is-flex-direction-column">
    <div class="is-flex-grow-1">
      <div v-for="(item, i) in roomStore.playlist" :key="item.video.videoId">
        <div class="is-flex is-gap-1 is-align-items-center">
          <div
            class="video-title"
            :class="{ 'has-text-weight-bold': i === roomStore.playlistIndex }"
          >
            {{ item.video.title }}
          </div>
          <button class="button">Cancel</button>
        </div>
      </div>
    </div>
    <div class="field has-addons">
      <p class="control">
        <input class="input" placeholder="Video URL" v-model="addingVideoUrl" />
      </p>
      <div class="control">
        <button
          class="button is-primary"
          @click="queueVideo()"
          @keyup.enter="queueVideo()"
        >
          Queue
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoomStore } from "@/store/room";
import { computed, ref } from "vue";

const roomStore = useRoomStore();

const addingVideoUrl = ref("");

function queueVideo() {
  roomStore.addVideo(addingVideoUrl.value);
  addingVideoUrl.value = "";
}
</script>

<style lang="scss" scoped>
.video-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

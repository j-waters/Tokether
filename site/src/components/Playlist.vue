<template>
  <div class="is-flex is-flex-direction-column is-fh">
    <div class="is-flex-grow-1" style="overflow: auto">
      <PlaylistRow v-for="item in playlist" :key="item.itemId" :item="item" />
    </div>
    <p class="help has-text-left mt-5 mb-1">
      You can also paste in a list of videos, where each one is on a new line
    </p>
    <div class="field has-addons">
      <p class="control" style="width: 100%">
        <textarea
          class="input"
          placeholder="Video URL"
          v-model="addingVideoUrl"
        />
      </p>
      <div class="control">
        <button class="button is-primary" @click="queueVideo()">Queue</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoomStore } from "@/store/room";
import { computed, ref, watch } from "vue";
import PlaylistRow from "@/components/PlaylistRow.vue";
import { usePlaylistStore } from "@/store/playlist";

//@keyup.enter="queueVideo()"
const playlistStore = usePlaylistStore();

const playlist = computed(() => playlistStore.playlist);

const addingVideoUrl = ref("");

watch(addingVideoUrl, (value) => {
  if (value.includes("\n")) {
    playlistStore.addVideos(value.split("\n"));
    addingVideoUrl.value = "";
  }
});

function queueVideo() {
  playlistStore.addVideo(addingVideoUrl.value);
  addingVideoUrl.value = "";
}
</script>

<style lang="scss" scoped>
//max-height: calc(100vh - 1.5rem - 52px - 3rem);
//overflow-y: auto;
textarea {
  overflow: hidden;
  resize: none;
  white-space: pre;
}
</style>

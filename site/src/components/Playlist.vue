<template>
  <div class="box is-fh is-flex is-flex-direction-column">
    <div class="is-flex-grow-1" style="overflow: auto">
      <PlaylistRow
        v-for="(item, i) in roomStore.playlist"
        :key="item.video.videoId"
        :item="item"
        :index="i"
      />
    </div>
    <div class="field has-addons mt-5">
      <p class="control">
        <textarea
          class="input"
          style="resize: none"
          placeholder="Video URL"
          v-model="addingVideoUrl"
        />
      </p>
      <div class="control">
        <button class="button is-primary" @click="queueVideo()">Queue</button>
      </div>
    </div>
    <p class="help">
      You can also paste in a list of videos, where each one is on a new line
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useRoomStore } from "@/store/room";
import { computed, ref, watch } from "vue";
import PlaylistRow from "@/components/PlaylistRow.vue";

//@keyup.enter="queueVideo()"
const roomStore = useRoomStore();

const addingVideoUrl = ref("");

watch(addingVideoUrl, (value) => {
  if (value.includes("\n")) {
    roomStore.addVideos(value.split("\n"));
    addingVideoUrl.value = "";
  }
});

function queueVideo() {
  roomStore.addVideo(addingVideoUrl.value);
  addingVideoUrl.value = "";
}
</script>

<style lang="scss" scoped>
//max-height: calc(100vh - 1.5rem - 52px - 3rem);
//overflow-y: auto;
</style>

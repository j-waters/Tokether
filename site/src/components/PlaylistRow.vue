<template>
  <div
    class="is-flex is-gap-1 is-align-items-center is-justify-content-space-between"
  >
    <div
      class="video-title is-clickable"
      :class="{ 'has-text-weight-bold': index === roomStore.playlistIndex }"
      @click="roomStore.setPlaylistIndex(index)"
    >
      <span class="has-text-grey">@{{ item.video.author_name }}</span>
      {{ item.video.title }}
    </div>
    <button class="button">Cancel</button>
  </div>
</template>

<script lang="ts" setup>
import { PlaylistItem, useRoomStore } from "@/store/room";
import { computed } from "vue";

const roomStore = useRoomStore();

const props = defineProps<{ item: PlaylistItem; index: number }>();
</script>

<style scoped>
.video-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

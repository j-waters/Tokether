<template>
  <div class="is-flex is-flex-direction-column is-align-items-center is-fh">
    <TikTok
      v-for="item in playerStore.loadedVideos"
      :video-id="item.videoId"
      :key="item.itemId"
      v-show="isCurrent(item)"
      :class="{ 'current-iframe': isCurrent(item) }"
    />
    <div class="buttons" style="width: 100%">
      <button
        class="button is-primary is-flex-grow-1"
        @click="roomStore.navigatePlaylist(-1)"
      >
        Prev
      </button>
      <button
        class="button is-primary is-flex-grow-1"
        @click="roomStore.navigatePlaylist(1)"
        @keyup.right="roomStore.navigatePlaylist(1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TikTok from "@/components/TikTok.vue";
import { useRoomStore } from "@/store/room";
import { usePlayerStore } from "@/store/player";
import { isCurrent } from "@/store/playlist";

const roomStore = useRoomStore();

const playerStore = usePlayerStore();
</script>

<style scoped></style>

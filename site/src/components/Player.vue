<template>
  <div class="box is-fh">
    <div class="is-flex is-flex-direction-column is-align-items-center is-fh">
      <TikTok
        v-for="item in roomStore.loadedVideos"
        :video-id="item.videoId"
        :key="item.itemId"
        v-show="item.isCurrent"
        :class="{ 'current-iframe': item.isCurrent }"
      />
      <div class="buttons" style="width: 100%">
        <button
          class="button is-primary is-flex-grow-1"
          @click="roomStore.prevVideo()"
        >
          Prev
        </button>
        <button
          class="button is-primary is-flex-grow-1"
          @click="roomStore.nextVideo()"
          @keyup.right="roomStore.nextVideo()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TikTok from "@/components/TikTok.vue";
import { useRoomStore } from "@/store/room";
import { usePlayerStore } from "@/store/player";

const roomStore = useRoomStore();

const playerStore = usePlayerStore();
playerStore.init();
</script>

<style scoped></style>

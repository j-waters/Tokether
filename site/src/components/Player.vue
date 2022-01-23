<template>
  <div class="box is-fh">
    <div class="is-flex is-flex-direction-column is-align-items-center is-fh">
      <TikTok :video-id="roomStore.currentVideo?.videoId" />
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

const roomStore = useRoomStore();
</script>

<style scoped></style>

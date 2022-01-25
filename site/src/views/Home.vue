<template>
  <div class="container">
    <section class="section has-text-centered">
      <h1 class="title">
        Watch TikToks
        <span class="glitch-text" data-text="Tokether">Tokether</span>
      </h1>
      <p class="subtitle is-3">Create a room and share it with your friends</p>
      <button
        class="button is-primary is-large is-outlined"
        @click="roomStore.createRoom()"
      >
        New room
      </button>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useRoomStore } from "@/store/room";

const roomStore = useRoomStore();
</script>

<style lang="scss" scoped>
@import "~@/colours";

.title {
  font-size: 5rem;
}
</style>

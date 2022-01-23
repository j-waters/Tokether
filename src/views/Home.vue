<template>
  <button class="button is-primary" @click="roomStore.createRoom()">
    New room
  </button>
</template>

<script lang="ts" setup>
import { useRoomStore } from "@/store/room";

const roomStore = useRoomStore();
</script>

<template>
  <section class="hero">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <Navbar />
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body is-align-items-stretch" style="overflow: hidden">
      <div class="container is-fh">
        <div class="columns is-multiline is-fh">
          <div class="column is-8">
            <Player />
          </div>
          <div class="column is-4">
            <Playlist />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import TikTok from "@/components/TikTok.vue";
import Player from "@/components/Player.vue";
import Playlist from "@/components/Playlist.vue";
import { db } from "@/helpers/database";
import { useRoomStore } from "@/store/room";
import Navbar from "@/components/Navbar.vue";
import { onUnmounted } from "vue";

const props = defineProps<{ id: string }>();

const roomStore = useRoomStore();

roomStore.loadRoom(props.id);

onUnmounted(() => roomStore.leave());
</script>

<style lang="scss" scoped>
.hero {
  height: 100vh;

  .hero-body {
    flex-shrink: 1;
  }
}

.column {
  height: 100%;
}
</style>

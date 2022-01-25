<template>
  <section class="hero">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <Navbar />
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body is-align-items-stretch" style="overflow: hidden">
      <div class="tile is-ancestor is-fh">
        <div class="tile is-parent">
          <div class="tile is-child box">
            <Player />
          </div>
        </div>
        <div class="tile is-4 is-vertical is-parent">
          <div class="tile is-child box">
            <UserList />
          </div>
          <div
            class="tile is-child box is-flex-grow-3"
            style="overflow: hidden"
          >
            <Playlist />
          </div>
        </div>
      </div>
      <!--        <div class="columns is-multiline is-fh">-->
      <!--          <div class="column is-8">-->
      <!--            <Player />-->
      <!--          </div>-->
      <!--          <div class="column is-4">-->
      <!--            <Playlist />-->
      <!--          </div>-->
      <!--        </div>-->
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
import UserList from "@/components/UserList.vue";

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

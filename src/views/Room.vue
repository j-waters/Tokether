<template>
  <section class="hero is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <header class="navbar">
        <div class="container">
          <div class="navbar-menu">
            <div class="navbar-end"></div>
          </div>
        </div>
      </header>
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body is-align-items-stretch">
      <div class="container has-text-centered">
        <div class="columns is-fh">
          <div class="column is-fh is-8">
            <Player />
          </div>
          <div class="column is-fh is-4">
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

const props = defineProps<{ id: string }>();
</script>

<style lang="scss" scoped></style>

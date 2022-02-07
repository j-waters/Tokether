<template>
  <section class="hero">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <Navbar />
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body is-align-items-stretch">
      <div class="tile is-ancestor h-100">
        <div class="tile is-parent fh-column">
          <div class="tile is-child box h-100">
            <Player v-if="playlistNotEmpty" />
            <div
              class="title is-5 is-flex is-justify-content-center is-align-items-center h-100"
              v-else
            >
              Add a video to the playlist to start watching!
            </div>
          </div>
        </div>
        <div class="tile is-4 is-vertical is-parent fh-column">
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
    </div>

    <Modal
      :open="usersStore.username == null"
      title="Set username"
      :closable="false"
    >
      <input class="input" v-model="newUsername" placeholder="Username" />
      <template v-slot:footer>
        <button
          class="button is-primary"
          @click="usersStore.setUsername(newUsername)"
        >
          Save
        </button>
      </template>
    </Modal>
  </section>
</template>

<script lang="ts" setup>
import TikTok from "@/components/TikTok.vue";
import Player from "@/components/Player.vue";
import Playlist from "@/components/Playlist.vue";
import { db } from "@/helpers/database";
import { useRoomStore } from "@/store/room";
import Navbar from "@/components/Navbar.vue";
import { computed, onUnmounted, ref } from "vue";
import UserList from "@/components/UserList.vue";
import Modal from "@/components/Modal.vue";
import { useUsersStore } from "@/store/users";
import { usePlaylistStore } from "@/store/playlist";

const props = defineProps<{ id: string }>();

const roomStore = useRoomStore();
const usersStore = useUsersStore();
const playlistStore = usePlaylistStore();

roomStore.loadRoom(props.id);

onUnmounted(() => roomStore.leave());

const newUsername = ref<string>(usersStore.username ?? "");

const playlistNotEmpty = computed(() => playlistStore.playlist.length > 0);
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

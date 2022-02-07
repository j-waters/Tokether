<template>
  <div
    class="is-flex is-gap-1 is-align-items-center is-justify-content-space-between is-clickable"
  >
    <div
      class="video-title"
      :class="{ 'has-text-weight-bold': isCurrent(item) }"
      @click="roomStore.setPlaylistItem(item.itemId)"
    >
      <span class="has-text-grey">@{{ author }}</span>
      {{ title }}
    </div>
    <div class="buttons">
      <button
        class="button is-danger is-small is-outlined"
        @click="playlistStore.removeItem(item.itemId)"
      >
        <span class="icon">
          <i class="fas fa-trash fa-lg"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoomStore } from "@/store/room";
import { isCurrent, PlaylistItem, usePlaylistStore } from "@/store/playlist";
import { computed, ref, watch } from "vue";
import { TikTokVideo } from "@tokether/common";

const roomStore = useRoomStore();
const playlistStore = usePlaylistStore();

const props = defineProps<{ item: PlaylistItem }>();

const author = computed(
  () => props.item.fullInfo?.author_name ?? props.item.author.replace("@", "")
);
const title = computed(() => props.item.fullInfo?.title);
</script>

<style scoped>
.video-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

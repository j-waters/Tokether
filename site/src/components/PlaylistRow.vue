<template>
  <div
    class="playlist-row is-flex is-gap-1 is-align-items-center is-justify-content-space-between is-clickable"
  >
    <div class="thumbnail">
      <img :src="item.fullInfo.thumbnail_url" />
      <img class="thumbnail-hover" :src="item.fullInfo.thumbnail_url" />
    </div>
    <div
      class="video-title is-flex-grow-4"
      :class="{ 'has-text-weight-bold': isCurrent(item) }"
      @click="roomStore.setPlaylistItem(item.itemId)"
    >
      <span class="has-text-grey">@{{ author }}</span>
      {{ title }}
    </div>
    <div class="buttons is-flex-shrink-0">
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

<style lang="scss" scoped>
.video-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thumbnail {
  width: 20%;
  flex-shrink: 0;
  max-width: 50px;

  position: relative;

  $hover-transition-duration: 0.4s;

  .thumbnail-hover {
    opacity: 0;
    position: absolute;
    width: 100%;
    transition: width $hover-transition-duration,
      opacity 0s $hover-transition-duration;
    top: 0;
    z-index: 10;
    display: block;
  }

  &:hover .thumbnail-hover {
    transition: width $hover-transition-duration;
    opacity: 1;
    width: 200px;
  }

  img {
    max-width: none;
    width: 100%;
    height: auto;
  }
}
</style>

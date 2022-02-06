<template>
  <div
    class="is-flex is-gap-1 is-align-items-center is-justify-content-space-between"
  >
    <div
      class="video-title is-clickable"
      :class="{ 'has-text-weight-bold': isCurrent(item) }"
      @click="roomStore.setPlaylistItem(item.itemId)"
    >
      <span class="has-text-grey">@{{ author }}</span>
      {{ title }}
    </div>
    <button class="button">Cancel</button>
  </div>
</template>

<script lang="ts" setup>
import { useRoomStore } from "@/store/room";
import { isCurrent, PlaylistItem } from "@/store/playlist";
import { computed, ref, watch } from "vue";
import { TikTokVideo } from "@tokether/common";

const roomStore = useRoomStore();

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

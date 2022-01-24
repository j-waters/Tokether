<template>
  <div class="is-flex-grow-1">
    <div class="tiktok-wrapper">
      <iframe
        :src="embedUrl"
        allowfullscreen
        scrolling="no"
        allow="autoplay; encrypted-media;"
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getEmbedUrl, TikTokVideo } from "@tokether/common/lib/tiktok";
import { computed, onUnmounted } from "vue";
import { usePlayerStore } from "@/store/player";

const props = defineProps<{ videoId: string }>();

const embedUrl = computed(() => getEmbedUrl(props.videoId));

onUnmounted(() => {
  const playerStore = usePlayerStore();
  playerStore.unloadVideoId(props.videoId);
});
</script>

<style lang="scss" scoped>
.tiktok-wrapper {
  aspect-ratio: 0.48;
  height: 100%;
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>

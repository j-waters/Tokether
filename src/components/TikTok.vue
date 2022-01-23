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
import { TikTokVideo } from "@/helpers/tiktok";
import { computed } from "vue";

const props = defineProps<{ videoId: string }>();

const embedUrl = computed(
  () => `https://www.tiktok.com/embed/${props.videoId}`
);
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

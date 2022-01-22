<template>
  <div class="is-flex-grow-1">
    <div class="tiktok-wrapper">
      <iframe
        src="https://www.tiktok.com/embed/7024976493956615429?autoplay=1"
        allowfullscreen
        scrolling="no"
        allow="autoplay; encrypted-media;"
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ url: string }>();
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

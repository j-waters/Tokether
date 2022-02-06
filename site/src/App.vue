<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useGlobalStore } from "@/store/global";

const globalStore = useGlobalStore();
globalStore.init();
</script>

<style lang="scss">
html {
  overflow-y: auto;
}
</style>

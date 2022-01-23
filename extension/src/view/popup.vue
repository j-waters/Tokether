<template>
  <div class="main_app">
    <h1>Hello</h1>
    <button class="button" @click="scrape()">Scrape</button>
    <div v-for="r in resp" :key="r">{{ r }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const resp = ref([]);
function scrape() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "scrape" },
      function (response) {
        resp.value = response;
      }
    );
  });
}
</script>

<style>
.main_app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

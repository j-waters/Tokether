<template>
  <button class="button is-primary" @click="createRoom()">New room</button>
</template>

<script lang="ts" setup>
import createRoom from "@/helpers/createRoom";
</script>

<template>
  <div
    v-for="user in usersStore.activeUsers"
    :key="user.userId"
    class="is-flex is-gap-1 is-align-items-center is-justify-content-space-between"
  >
    <div>
      {{ user.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUsersStore } from "@/store/users";

const usersStore = useUsersStore();
</script>

<style scoped></style>

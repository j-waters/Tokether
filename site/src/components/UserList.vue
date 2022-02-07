<template>
  <div class="tags">
    <span
      v-for="user in users"
      :key="user.userId"
      class="tag is-info is-large is-secondary is-rounded"
    >
      <span class="icon-text">
        <span class="icon" v-if="user.isCurrent">
          <i class="fas fa-user"></i>
        </span>
        <span class="icon" v-if="user.connectionStatus !== 'good'">
          <span
            class="signal"
            :class="{
              'has-text-warning': user.connectionStatus === 'poor',
              'has-text-danger': user.connectionStatus !== 'poor',
            }"
          >
            <span />
            <span />
            <span />
          </span>
        </span>
        <span v-if="!user.hasExtension" class="icon has-text-danger-dark">
          <i class="fas fa-puzzle-piece"></i>
        </span>
        <span>{{ user.username }}</span>
      </span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { UserStatus, useUsersStore } from "@/store/users";
import { computed } from "vue";

const usersStore = useUsersStore();

const users = computed(() => usersStore.activeUsers);
</script>

<style lang="scss" scoped>
.signal {
  height: 1em;
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-around;
  aspect-ratio: 1;

  span {
    width: 4px;
    background-color: currentColor;
    display: inline-block;
    &:nth-child(1) {
      height: 33%;
    }
    &:nth-child(2) {
      height: 66%;
    }
    &:nth-child(3) {
      height: 100%;
    }
  }
}

.icon-text .icon:not(:first-child) {
  margin-left: 0;
}
</style>

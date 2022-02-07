<template>
  <div class="tags">
    <span
      v-for="user in users"
      :key="user.userId"
      class="tag is-info is-large is-secondary is-rounded"
    >
      <span class="icon-text">
        <span
          class="icon has-tooltip-arrow has-tooltip-bottom"
          v-if="user.isCurrent"
          data-tooltip="This is you!"
        >
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
        <span
          v-if="!user.hasExtension"
          class="icon has-text-danger-dark has-tooltip-arrow has-tooltip-multiline has-tooltip-bottom"
          data-tooltip="This user doesn't have the Tokether extension - autoplay will be disabled for everyone"
        >
          <i class="fas fa-puzzle-piece"></i>
        </span>
        <span>{{ user.username }}</span>
      </span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { useUsersStore } from "@/store/users";
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

[data-tooltip] {
  border-bottom: none;
}
</style>

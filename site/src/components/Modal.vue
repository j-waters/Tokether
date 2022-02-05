// Authors: James Waters
<template>
  <teleport to="#app">
    <transition name="fade">
      <div v-if="open" class="modal is-active" id="modal">
        <div class="modal-background" @click="emit('close')"></div>
        <div class="modal-card">
          <header class="modal-card-head" v-if="$slots.header || title">
            <slot name="header"
              ><p class="modal-card-title">{{ title }}</p></slot
            >
          </header>
          <section class="modal-card-body">
            <slot></slot>
          </section>
          <footer
            v-if="$slots.footer"
            class="modal-card-foot buttons is-right mb-0"
          >
            <slot name="footer"></slot>
          </footer>
          <button
            @click="emit('close')"
            class="modal-close is-large"
            aria-label="close"
            v-if="closable"
          ></button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{ open: boolean; title?: string; closable?: boolean }>(),
  { closable: true }
);
const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/*.modal-card-body {*/
/*  overflow-x: hidden;*/
/*}*/
</style>

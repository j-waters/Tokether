<template>
  <button
    class="button"
    :class="{ 'is-success': state[stateKey] }"
    @click="setState({ [stateKey]: !state[stateKey] })"
  >
    {{ state[stateKey] ? "On" : "Off" }}
  </button>
</template>

<script lang="ts" setup>
import { ExtensionState } from "@tokether/common";

const props =
  defineProps<{ stateKey: keyof ExtensionState; state: ExtensionState }>();

const emit = defineEmits<{
  (e: "update:state", value: ExtensionState);
}>();

function setState(updateState: Partial<ExtensionState>) {
  chrome.runtime.sendMessage(
    {
      type: "setState",
      ...updateState,
    },
    (newState) => emit("update:state", newState)
  );
}
</script>

<style scoped></style>

<template>
  <button
    class="button"
    :class="{ 'is-success': value }"
    @click="toggle()"
  >
    {{ state[stateKey] ? "On" : "Off" }}
  </button>
</template>

<script lang="ts" setup>
import { ExtensionState } from "@tokether/common";
import {useState} from "@/helpers/useState";
import {computed} from "vue";

const {state, asyncState} = useState()

const value = computed(() => state.value[props.stateKey])

const props =
  defineProps<{ stateKey: keyof ExtensionState }>();

function toggle() {
  asyncState.set({[props.stateKey]: !value.value})
}
</script>

<style scoped></style>

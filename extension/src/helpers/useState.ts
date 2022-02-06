import state from "@/helpers/state";
import {ref} from "vue";
import {ExtensionState} from "@tokether/common";
import {DEFAULT_STATE} from "@tokether/common/lib/types";

const syncState = ref<ExtensionState>({...DEFAULT_STATE})
state.valueStream.subscribe(value => syncState.value = value)

export function useState() {
    return {state: syncState, asyncState: state}
}

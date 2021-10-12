<template>
  <div class="about">
    Debug {{ account }}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { hasMetaMask, requestAccount, ethereum } from "../utils/MetaMask";
import { functions, auth } from "../utils/firebase";

export default defineComponent({
  name: "Account",
  setup() {
    const store = useStore();
    const account = computed(() => store.state.account);
    const assets = computed(() => store.state.assets);
    return {
      assets,
      account,
    }
  }
});
</script>
<template>
  <div class="about">
    <h1 class="text-4xl font-bold my-6">PixelBeasts</h1>
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
    const asset = computed(() => store.getters.asset);
    const debug1 = async () => {
      try {
        const debug1 = functions.httpsCallable('debug1');
        const result = await debug1({account, tokenId:asset.value.token_id});
        alert("success!");
      } catch(e) {
        alert(e);
      }
    };
    return {
      debug1,
    }
  }
});
</script>
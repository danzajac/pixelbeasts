<template>
  <div class="about">
    <a @click="debug1"
        class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
      Verify 
    </a>
  </div>
            {{ asset.token_id }}
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
        console.log(asset.value.token_id);
        const result = await debug1({account, tokenId:asset.value.token_id});
        console.log(result.data);
        console.log("custome claims", result.data.token);
        alert("success!");
      } catch(e) {
        alert(e);
      }
    };
    return {
      asset,
      debug1,
    }
  }
});
</script>
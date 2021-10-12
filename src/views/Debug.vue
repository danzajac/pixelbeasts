<template>
  <div class="about">
    Debug {{ account }}
    <a @click="debug1"
        class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
      Debug 
    </a>

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
    const debug1 = async () => {
      const debug1 = functions.httpsCallable('debug1');
      const asset = store.state.assets[0];
      console.log(asset.image_url);
      const tokenId = asset.token_id;
      console.log(tokenId);
      const result = await debug1({account, tokenId});
      console.log(result.data.asset.image_url);
    };
    return {
      debug1,
      assets,
      account,
    }
  }
});
</script>
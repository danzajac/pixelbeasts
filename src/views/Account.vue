<template>
  <div class="account">
    <div v-if="hasMetaMask">
      <div v-if="account">
        <p>{{ account }}</p>
        <a 
          @click="test"
          class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
        >
          Test
        </a>
      </div>
      <a v-else
        @click="metaMaskSignin"
        class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
      >
        Signin with MetaMask
      </a>
    </div>
    <div v-else>
      You need to have MetaMask extension installed to your browser.
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { hasMetaMask, requestAccount, ethereum } from "../utils/MetaMask";
import * as util from "ethereumjs-util";

export default defineComponent({
  name: "Account",
  setup() {
    const store = useStore();
    const metaMaskSignin = async () => {
      await requestAccount(); // ethereum.on('accountsChanged') will handle the result
    };
    const test = async () => {
      const account = store.state.account;
      const message = "Hello World";
      const signature = await ethereum.request({ method: 'personal_sign', params: [message, account] });
      //const result = await ethereum.request({ method: 'eth_accounts' });
      alert(signature);

      const nonce1 = "\x19Ethereum Signed Message:\n" + message.length + message;
      const nonce = util.keccak(Buffer.from(nonce1, "utf-8"))
      const { v, r, s } = util.fromRpcSig(signature)
      const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s)
      const addrBuf = util.pubToAddress(pubKey)
      const addr = util.bufferToHex(addrBuf)
      alert(addr);
    }
    const account = computed(() => store.state.account);
    return {
      test,
      account,
      hasMetaMask,
      metaMaskSignin
    }
  }
});
</script>

<template>
  <div class="account">
    <div v-if="hasMetaMask">
      <div v-if="account">
        <p>{{ account }}</p>
        <a 
          @click="verifyIdentity"
          class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
        >
          Verify Identity
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
import firebase from "firebase";

const functions = firebase.functions;

export default defineComponent({
  name: "Account",
  setup() {
    const store = useStore();
    const metaMaskSignin = async () => {
      await requestAccount(); // ethereum.on('accountsChanged') will handle the result
    };
    const verifyIdentity = async () => {
      const account = store.state.account;
      const generateNonce = functions().httpsCallable('generateNonce');
      const result = await generateNonce({account});
      const nonce = result.data.nonce;
      const result2 = await ethereum.request({ method: 'personal_sign', params: [nonce, account] });
      alert(result2);
    }
    const account = computed(() => store.state.account);
    return {
      verifyIdentity,
      account,
      hasMetaMask,
      metaMaskSignin
    }
  }
});
</script>

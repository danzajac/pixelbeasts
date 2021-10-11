<template>
  <div class="account">
    <div v-if="isSiginedIn">
      <a 
        @click="signOut"
        class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
      >
        Sign Out
      </a>
    </div>
    <div v-else>
      <div v-if="hasMetaMask">
        <div v-if="account">
          <p>{{ account }}</p>
          <a 
            @click="verifyIdentity"
            class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
          >
            Sign In with MetaMask ID
          </a>
        </div>
        <a v-else
          @click="metaMaskConnect"
          class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
        >
          Connect with MetaMask
        </a>
      </div>
      <div v-else>
        You need to have MetaMask extension installed to your browser.
      </div>
    </div>
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
    const isSiginedIn = computed(() => store.getters.isSiginedIn);
    const metaMaskConnect = async () => {
      await requestAccount(); // ethereum.on('accountsChanged') will handle the result
    };
    const verifyIdentity = async () => {
      const account = store.state.account;
      const generateNonce = functions.httpsCallable('generateNonce');
      const result = await generateNonce({account});
      const nonce = result.data.nonce;
      const signature = await ethereum.request({ method: 'personal_sign', params: [nonce, account] });
      const verifyNonce = functions.httpsCallable('verifyNonce');
      const result2 = await verifyNonce({account, signature});
      const token = result2.data.token; 
      const credential = await auth.signInWithCustomToken(token);
      const user = credential.user; 
    }
    const signOut = async () => {
      await auth.signOut();
    }
    const account = computed(() => store.state.account);
    return {
      signOut,
      verifyIdentity,
      account,
      isSiginedIn,
      hasMetaMask,
      metaMaskConnect
    }
  }
});
</script>

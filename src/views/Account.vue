<template>
  <div class="account">
    <div v-if="hasMetaMask">
      <div v-if="account">
        <div class="border-2 p-2 m-2">{{ account }}</div>
        <div v-if="isSiginedIn">
          <p class="m-4">You are signed-in with your MetaMask identity.
                      <a 
            @click="signOut"
            class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
          >
            Sign Out
          </a>

          </p>
          <div v-if="assets">
            <div v-for="asset in assets" :key="asset.id">
              <a @click="selectAsset"
            class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
              {{ asset.name }} 
              <img :src="asset.image_thumbnail_url" />
              </a>
            </div>
          </div>
          <div v-else>
            <p>Fetching assets...</p>
          </div>
        </div>
        <div v-else>
        <p class="m-4">This site is connected with the MetaMask extension.<br/> 
          Please sign-in by signing a message from PixelBeasts.</p>
          <a 
            @click="verifyIdentity"
            class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
          >
            Step 2: Sign In
          </a>
        </div>
      </div>
      <div v-else>
        <p class="m-4">Please connect this site with the MetaMask extension,<br/>
          then sign-in by signing a message from PixelBeasts.</p>
        <a @click="metaMaskConnect"
          class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
        >
          Step 1: Connect with MetaMask
        </a>
      </div>
    </div>
    <div v-else>
      You need to have <a target="_blank" class="underline" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">MetaMask extension</a> installed to your browser.
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
      const uuid = result.data.uuid;
      console.log("verifyIdentity: uuid/nonce", uuid, nonce);
      const signature = await ethereum.request({ method: 'personal_sign', params: [nonce, account] });
      const verifyNonce = functions.httpsCallable('verifyNonce');
      const result2 = await verifyNonce({account, signature, uuid});
      const token = result2.data.token; 
      console.log("verifyIdentity: token", token)
      if (token) {
        const credential = await auth.signInWithCustomToken(token);
        const user = credential.user; 
      } else {
        alert("Failed to verifyIdenty")
      }
    };
    const signOut = async () => {
      await auth.signOut();
    };
    const selectAsset = () => {
      alert('selected');
    };
    const account = computed(() => store.state.account);
    const assets = computed(() => store.state.assets);
    return {
      selectAsset,
      assets,
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

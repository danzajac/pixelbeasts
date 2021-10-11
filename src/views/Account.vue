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
              {{ asset.name }}
            </div>
          </div>
          <div v-else>
            <a 
              @click="fetchAssets"
              class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
            >
              Step 3: Fetch your PixelBeasts assets.
            </a>
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
      const signature = await ethereum.request({ method: 'personal_sign', params: [nonce, account] });
      const verifyNonce = functions.httpsCallable('verifyNonce');
      const result2 = await verifyNonce({account, signature});
      const token = result2.data.token; 
      const credential = await auth.signInWithCustomToken(token);
      const user = credential.user; 
    };
    const signOut = async () => {
      await auth.signOut();
    };
    const fetchAssets = async () => {
      const account = store.state.account;
      const params: Record<string, string> = {
        "owner": String(account),
        "order_direction": "desc",
        "offset": String(0),
        "limit": String(40),
        "collection": "beastopia-pixelbeasts"
      };
      const query = Object.keys(params).map(key => { return key+"="+encodeURIComponent(params[key])});
      const url = "https://api.opensea.io/api/v1/assets?"+query.join('&');
      const result = await fetch(url);
      const json = await result.json();
      const assets = json["assets"];
      store.commit('setAssets', assets);
    };
    const account = computed(() => store.state.account);
    const assets = computed(() => store.state.assets);
    return {
      assets,
      fetchAssets,
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

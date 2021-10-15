<template>
  <div class="account">
    <div v-if="hasMetaMask">
      <div v-if="account">
        <div class="border-2 p-2 m-2">
          <p>This site is connected with the MetaMask extension.</p>
          {{ account }}
        </div>
        <div v-if="isSiginedIn">
          <p class="m-4">
            You are signed-in with your MetaMask identity.
            <a @click="signOut" id="button"> Sign Out </a>
          </p>
          <div v-if="assets">
            <div v-for="(asset, index) in assets" :key="asset.id">
              <a
                @click="
                  () => {
                    selectAsset(index);
                  }
                "
                id="button"
                class="m-2"
              >
                <span>{{ asset.name }}</span>
                <img :src="asset.image_thumbnail_url" class="m-2 w-20" />
              </a>
            </div>
          </div>
          <div v-else>
            <p>Fetching assets...</p>
          </div>
        </div>
        <div v-else>
          <div v-if="isBusy">
            {{ isBusy }}
          </div>
          <div v-else>
            <p class="m-4">
              Please sign-in by signing a message from PixelBeasts.
            </p>
            <a @click="verifyIdentity" id="button" class="h-12">
              Step 2: Sign In
            </a>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="m-4">
          Please connect this site with the MetaMask extension,<br />
          then sign-in by signing a message from PixelBeasts.
        </p>
        <a @click="metaMaskConnect" id="button" class="h-12">
          Step 1: Connect with MetaMask
        </a>
      </div>
    </div>
    <div v-else>
      You need to have
      <a
        target="_blank"
        class="underline"
        href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
        >MetaMask extension</a
      >
      installed to your browser.
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { hasMetaMask, requestAccount, ethereum } from "../utils/MetaMask";
import { functions, auth } from "../utils/firebase";

export default defineComponent({
  name: "Account",
  setup() {
    const store = useStore();
    const isSiginedIn = computed(() => store.getters.isSiginedIn);
    const isBusy = ref("");
    const metaMaskConnect = async () => {
      await requestAccount(); // ethereum.on('accountsChanged') will handle the result
    };
    const verifyIdentity = async () => {
      // Step 1: We get a nonce from the server
      isBusy.value = "Fetching a verification message from server...";
      const account = store.state.account;
      const generateNonce = functions.httpsCallable("generateNonce");
      const result = await generateNonce({ account });
      const nonce = result.data.nonce;
      const uuid = result.data.uuid;

      console.log("verifyIdentity: uuid/nonce", uuid, nonce);

      try {
        // Step 2: We ask the user to sign this nonce
        isBusy.value = "Waiting for you to sign a message...";
        const signature = await ethereum.request({
          method: "personal_sign",
          params: [nonce, account],
        });

        // Step 3: We ask the server to verify the signature and get custom token
        const verifyNonce = functions.httpsCallable("verifyNonce");
        const result2 = await verifyNonce({ signature, uuid });
        console.log(result2.data);
        const token = result2.data.token;
        console.log("verifyIdentity: token", token);
        if (token) {
          await auth.signInWithCustomToken(token);
        } else {
          alert("Failed to verifyIdenty");
        }
        isBusy.value = "";
      } catch (e) {
        isBusy.value = "Canceling the verification...";
        const deleteNonce = functions.httpsCallable("deleteNonce");
        await deleteNonce({ account, uuid });
        isBusy.value = "";
      }
    };
    const signOut = async () => {
      await auth.signOut();
    };
    const selectAsset = async (index: number) => {
      store.commit("setAssetIndex", index);
    };
    const account = computed(() => store.state.account);
    const assets = computed(() => store.state.assets);
    return {
      isBusy,
      selectAsset,
      assets,
      signOut,
      verifyIdentity,
      account,
      isSiginedIn,
      hasMetaMask,
      metaMaskConnect,
    };
  },
});
</script>

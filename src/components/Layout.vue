<template>
  <div class="layout">
    <template v-if="isSiginedIn"> </template>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";

import { auth } from "../utils/firebase";
import firebase from "firebase/app";
import { fetchAssets } from "../utils/OpenSea";

interface User {
  user: firebase.User | null;
}

export default defineComponent({
  name: "Layout",
  async setup() {
    const store = useStore();
    const isSiginedIn = computed(() => store.getters.isSiginedIn);
    const account = computed(() => store.state.account);

    onMounted(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("authStateChanged:");
          store.commit("setUser", reactive<User>({ user: user }));
          fetchAssets(store.state.account, "beastopia-pixelbeasts").then(
            (assets) => {
              store.commit("setAssets", assets);
              store.commit("setAssetIndex", 0);
            }
          );
        } else {
          store.commit("setUser", null);
        }
        store.commit("setAssetIndex", 0);
        store.commit("setAssets", []);
      });
    });

    /*
    const messageDoc = await db.doc("/test/message").get();
    const message = messageDoc.data();
    */

    return {
      isSiginedIn,
      account,
    };
  },
});
</script>

<template>
  <div id="nav">
    <template v-if="isSiginedIn">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/debug">Debug</router-link> |
      <router-link to="/account">Account</router-link>
    </template>
    <template v-else>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/account">Sign-In</router-link>
    </template>
  </div>
  <Suspense>
    <router-view />
  </Suspense>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { ethereum, getAccount, hasMetaMask } from "./utils/MetaMask";

export default {
  setup() {
    document.title = "Pixel Beasts"; // There might be a better way to do this, but it works.
    const store = useStore();
    getAccount().then((value) => {
      store.commit('setAccount', value);
    });
    if (hasMetaMask) {
      ethereum.on('accountsChanged', accounts => {
        if (accounts.length == 0) {
          store.commit('setAccount', null);
        } else {
          store.commit('setAccount', accounts[0]);
        }
      })
    }

    const isSiginedIn = computed(() => store.getters.isSiginedIn);

    return {
      isSiginedIn,
    };
  },
};
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */
  @apply font-sans antialiased text-center text-gray-700;
}

#nav {
  /* padding: 30px; */
  @apply p-8;
}

#nav a {
  /* font-weight: bold;
  color: #2c3e50; */
  @apply font-bold text-gray-700;
}

#nav a.router-link-exact-active {
  /* color: #42b983; */
  @apply text-green-600;
}

a {
  @apply cursor-pointer;
}
</style>

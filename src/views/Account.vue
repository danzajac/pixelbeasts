<template>
  <div class="account">
    <div v-if="hasMetaMask">
      <div v-if="account">{{ account }}</div>
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
import { hasMetaMask, requestAccount, getAccount } from "../utils/MetaMask";

export default defineComponent({
  name: "Account",
  setup() {
    const store = useStore();
    const metaMaskSignin = async () => {
      store.commit('setAccount', await requestAccount());
    };
    const account = computed(() => store.state.account);
    return {
      account,
      hasMetaMask,
      metaMaskSignin
    }
  }
});
</script>

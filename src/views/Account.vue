<template>
  <div class="account">
    <div v-if="hasMetaMask">
      <a
        @click="metaMaskSignin"
        class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
      >
        Signin with MetaMask
      </a>
    </div>
    <div v-else>
      You need to have MetaMask extension installed to the browser.
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { ethereum, hasMetaMask } from "../utils/MetaMask";
import { mapState } from 'vuex';

export default defineComponent({
  name: "Account",
  setup() {
    const metaMaskSignin = async () => {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      // this.store.account = account;
      alert("account:"+account);
    };
    return {
      hasMetaMask,
      metaMaskSignin
    }
  }
});
</script>

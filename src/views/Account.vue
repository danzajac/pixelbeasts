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
import { defineComponent, ref } from "vue";
import { hasMetaMask, requestAccount, getAccount } from "../utils/MetaMask";

export default defineComponent({
  name: "Account",
  setup() {
    const account = ref(null);
    getAccount().then((value) => {
      account.value = value;      
    })
    const metaMaskSignin = async () => {
      account.value = await requestAccount();
    };
    return {
      account,
      hasMetaMask,
      metaMaskSignin
    }
  }
});
</script>

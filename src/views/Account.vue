<template>
  <div class="account">
    <a
      @click="metaMaskSignin"
      class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
    >
      Signin with MetaMask
    </a>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ethereum } from "../utils/MetaMask";

export default defineComponent({
  name: "Account",
  methods: {
      metaMaskSignin: async () => {
        if (typeof ethereum !== 'undefined') {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          const account = accounts[0];
          alert(account);
        } else {
          alert("MetMask is NOT installed")
        }
      },
  },
});
</script>

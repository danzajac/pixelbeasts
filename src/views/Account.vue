<template>
  <div class="account">
    <a
      @click="metaMaskSignin"
      class="bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center h-12 px-6 rounded-lg hover:bg-green-600 hover:text-white"
    >
      Signin with Metamask
    </a>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { googleSignin } from "../utils/SocialLogin";

export default defineComponent({
  name: "Account",
  setup() {
    return {
      metaMaskSignin: () => {
        if (typeof window.ethereum !== 'undefined') {
          alert("MetMask is installed")
        } else {
          alert("MetMask is NOT installed")
        }
      },
    };
  },
});
</script>

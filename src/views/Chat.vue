<template>
  <div class="about">
    <h1 class="text-4xl font-bold my-6">{{ asset.token_id }}</h1>
    <div v-if="isCreating">
        Creating...
        <a @click="() => {newRoom(false)}"
    class="m-2 bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
        <span>Cancel</span>
        </a>
    </div>
    <a v-else @click="() => {newRoom(true)}"
class="m-2 bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
    <span>New Room</span>
    </a>

  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Account",
  setup() {
    const store = useStore();
    const asset = computed(() => store.getters.asset);
    const isCreating = ref(false);
    const newRoom = (flag: boolean) => {
      isCreating.value = flag;
    };
    return {
      isCreating,
      asset,
      newRoom,
    }
  }
});
</script>
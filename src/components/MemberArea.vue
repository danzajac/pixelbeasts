<template>
<div>
    <router-view v-if="isSiginedIn && haveAssets" />
    <div v-else>Loading....</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    const isSiginedIn = computed(() => store.getters.isSiginedIn);
    const haveAssets = computed(() => store.getters.haveAssets);
    
    return {
      isSiginedIn,
      haveAssets,
    };
  },
});
</script>

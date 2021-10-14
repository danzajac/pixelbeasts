<template>
  <div class="about">
    <h1 class="text-4xl font-bold my-6">{{ asset.token_id }}</h1>
    <div v-if="isCreating">
        Creating...
        <a @click="Create"
    class="m-2 bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
        <span>Create</span>
        </a>
        <a @click="() => {setCreating(false)}"
    class="m-2 bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
        <span>Cancel</span>
        </a>
    </div>
    <a v-else @click="() => {setCreating(true)}"
class="m-2 bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
    <span>New Room</span>
    </a>
    <div v-for="room in rooms" :key="room.id">
      {{ room.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { db } from "../utils/firebase";

export default defineComponent({
  name: "Account",
  setup() {
    const store = useStore();
    const asset = computed(() => store.getters.asset);
    const rooms = ref([{}]); // NOTE: I don't know how to specify empty object array in TypeScript.
    const isCreating = ref(false);
    const setCreating = (flag: boolean) => {
      isCreating.value = flag;
    };
    const collectinoId = "beastopia-pixelbeasts";
    const refRooms = db.collection(`collections/${collectinoId}/rooms`);
    const query = refRooms.orderBy("updated");
    const detatcher = query.onSnapshot(result => {
      rooms.value = result.docs.map(doc => Object.assign(doc.data(), {id:doc.id}));
    });

    const Create = async () => {
        const doc = await refRooms.add({
          name:"foo1",
          updated: 1,
          owner: asset.value.token_id
        });
        isCreating.value = false;
        console.log(doc.id);
    }
    return {
      rooms,
      isCreating,
      asset,
      setCreating,
      Create,
    }
  }
});
</script>
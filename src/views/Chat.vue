<template>
  <div class="about">
    <h1 class="text-4xl font-bold my-6">{{ asset.token_id }}</h1>
    <div v-if="isCreating">
        <input v-model="name" placeholder="room name">
        <a @click="CreateRoom"
    class="m-2 bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
        <span>Create</span>
        </a>
        <a @click="() => {setCreating(false)}"
    class="m-2 bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
        <span>Cancel</span>
        </a>
    </div>
    <div v-else >
      <a @click="() => {setCreating(true)}"
  class="m-2 bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
      <span>New Room</span>
      </a>
    </div>
    <div v-for="room in rooms" :key="room.id">
      {{ room.name }}
      <span v-if="room.mine">
        <a @click="()=>DeleteRoom(room.id)"
        class="m-2 bg-black bg-opacity-5 shadow-lg inline-flex justify-center items-center px-6 rounded-lg hover:bg-green-600 hover:text-white">
          Delete
        </a>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { db, firestore } from "../utils/firebase";

export default defineComponent({
  name: "Account",
  setup() {
    const store = useStore();
    const asset = computed(() => store.getters.asset);
    const name  = ref("");
    const rooms = ref([{}]); // NOTE: I don't know how to specify empty object array in TypeScript.
    const isCreating = ref(false);
    const setCreating = (flag: boolean) => {
      isCreating.value = flag;
    };
    const collectinoId = "beastopia-pixelbeasts";
    const refRooms = db.collection(`collections/${collectinoId}/rooms`);
    const query = refRooms.orderBy("updated");
    const detatcher = query.onSnapshot(result => {

      rooms.value = result.docs.map(roomDoc => {
        const roomData = roomDoc.data()
        return Object.assign(roomData, 
          {id:roomDoc.id, 
           mine:roomData.uid==store.state.account && roomData.tokenId==asset.value.token_id});
      });
    });

    const CreateRoom = async () => {
        const timestamp =  firestore.FieldValue.serverTimestamp();
        const data = {
          name: name.value,
          created: timestamp,
          updated: timestamp,
          uid: store.state.account,
          tokenId: asset.value.token_id
        };
        console.log(data);
        const doc = await refRooms.add(data);
        isCreating.value = false;
        name.value = "";
        console.log(doc.id);
    }
    const DeleteRoom = async (id: string) => {
      await refRooms.doc(id).delete();
    };
    return {
      name,
      rooms,
      isCreating,
      asset,
      setCreating,
      CreateRoom,
      DeleteRoom,
    }
  }
});
</script>
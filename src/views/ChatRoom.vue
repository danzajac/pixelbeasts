<template>
  <div class="about">
    <div v-for="room in rooms" :key="room.id">
      {{ room.name }}
      <span v-if="room.mine">
        <a @click="()=>DeleteRoom(room.id)"
          id="button">
          Delete
        </a>
      </span>
    </div>
    <div v-if="isCreating">
        <input v-model="name" placeholder="room name">
        <a @click="CreateRoom" id="button">
        <span>Create</span>
        </a>
        <a @click="() => {setCreating(false)}" id="button">
        <span>Cancel</span>
        </a>
    </div>
    <div v-else >
      <a @click="() => {setCreating(true)}" id="button">
      <span>+ Room</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref} from "vue";
import { useRoute } from 'vue-router';
import { useStore } from "vuex";
import { db, firestore } from "../utils/firebase";

export default defineComponent({
  name: "ChatRoom",
  setup() {
    const store = useStore();
    const route = useRoute();
    const asset = computed(() => store.getters.asset);
    const name  = ref("");
    const rooms = ref([{}]); // NOTE: I don't know how to specify empty object array in TypeScript.
    const isCreating = ref(false);
    const setCreating = (flag: boolean) => {
      isCreating.value = flag;
    };
    const collectinoId = "beastopia-pixelbeasts";
    const refMessages = db.collection(`collections/${collectinoId}/rooms/${route.params.roomId}/messages`);
    const query = refMessages.orderBy("updated");
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
        const doc = await refMessages.add(data);
        isCreating.value = false;
        name.value = "";
        console.log(doc.id);
    }
    const DeleteRoom = async (id: string) => {
      await refMessages.doc(id).delete();
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
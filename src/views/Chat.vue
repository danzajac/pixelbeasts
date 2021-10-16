<template>
  <div class="about">
    <div v-for="room in rooms" :key="room.id">
      <router-link :to="`/chat/${room.id}`">{{ room.data.title }}</router-link>
      <span v-if="room.mine">
        <a @click="() => DeleteRoom(room)" id="button"> Delete </a>
      </span>
    </div>
    <div v-if="isCreating">
      <input v-model="name" placeholder="room name" />
      <a @click="CreateRoom" id="button">
        <span>Create</span>
      </a>
      <a
        @click="
          () => {
            setCreating(false);
          }
        "
        id="button"
      >
        <span>Cancel</span>
      </a>
    </div>
    <div v-else>
      <a
        @click="
          () => {
            setCreating(true);
          }
        "
        id="button"
      >
        <span>+ Room</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, onUnmounted } from "vue";
import { useStore } from "vuex";
import { db, firestore } from "@/utils/firebase";
import { defaultCollectionId } from "@/utils/const";

import Room from "@/models/room";

export default defineComponent({
  name: "Chat",
  setup() {
    const store = useStore();
    const name = ref("");
    const rooms = reactive<Room[]>([]);
    const isCreating = ref(false);
    const setCreating = (flag: boolean) => {
      isCreating.value = flag;
    };
    const refRooms = db.collection(`collections/${defaultCollectionId}/rooms`);
    const query = refRooms.orderBy("updated");
    const detatcher = query.onSnapshot((result) => {
      rooms.splice(0);
      result.docs.map((roomDoc) => {
        const room = new Room(roomDoc);
        room.setMine(store.state.account, store.getters.assetTokenId);
        rooms.push(room);
      });
    });
    onUnmounted(detatcher);

    const CreateRoom = async () => {
      const timestamp = firestore.FieldValue.serverTimestamp();
      const data = {
        title: name.value,
        created: timestamp,
        updated: timestamp,
        uid: store.state.account,
        tokenId: store.getters.assetTokenId,
        name: store.getters.assetName,
      };
      console.log(data);
      await refRooms.add(data);
      isCreating.value = false;
      name.value = "";
    };
    const DeleteRoom = async (room: Room) => {
      await room.deleteModel();
      // TODO: delete all messages ??
    };
    return {
      name,
      rooms,
      isCreating,
      setCreating,
      CreateRoom,
      DeleteRoom,
    };
  },
});
</script>

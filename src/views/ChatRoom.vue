<template>
  <div class="about">
    <div v-for="message in messages" :key="message.id">
      <router-link :to="`/messages/${message.data.tokenId}`">{{ message.data.name }}</router-link>
       {{ message.data.message }}
      <span v-if="message.mine">
        <a @click="() => DeleteMessage(message)" id="button"> Delete </a>
      </span>
    </div>
    <input v-model="name" placeholder="your message" />
    <a @click="PostMessage" id="button">
      <span>Post</span>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { db, firestore } from "../utils/firebase";

import { defaultCollectionId } from "@/utils/const";
import Message from "@/models/message";

export default defineComponent({
  name: "ChatRoom",
  setup() {
    const store = useStore();
    const route = useRoute();
    const asset = computed(() => store.getters.asset);
    const name = ref("");
    const messages = reactive<Message[]>([]);
    const refMessages = db.collection(
      `collections/${defaultCollectionId}/rooms/${route.params.roomId}/messages`
    );
    const messageQuery = refMessages.orderBy("created");
    const detatcher = messageQuery.onSnapshot((result) => {
      result.docChanges().forEach((change) => {
        if (change.type === "added") {
          const message = new Message(change.doc);
          message.setMine(store.state.account, asset.value.data.token_id);
          messages.push(message);
        } else if (change.type === "removed") {
          const removedId = change.doc.id;
          const removedIndex = messages.findIndex((d) => d.id === removedId);
          if (removedIndex !== undefined) {
            delete messages[removedIndex];
            messages.splice(removedIndex, 1);
          }
        }
        // TODO modified if need
      });
    });
    onUnmounted(detatcher);

    const PostMessage = async () => {
      const timestamp = firestore.FieldValue.serverTimestamp();
      const data = {
        message: name.value,
        created: timestamp,
        updated: timestamp,
        uid: store.state.account,
        tokenId: asset.value.data.token_id,
        name: asset.value.data.name,
      };
      const doc = await refMessages.add(data);
      name.value = "";
    };
    const DeleteMessage = async (message: Message) => {
      await message.deleteModel();
    };
    return {
      name,
      messages,
      asset,
      PostMessage,
      DeleteMessage,
    };
  },
});
</script>

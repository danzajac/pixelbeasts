import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/components/Layout.vue";
import MemberArea from "@/components/MemberArea.vue";
import Home from "@/views/Home.vue";
import Account from "@/views/Account.vue";
import About from "@/views/About.vue";
import Debug from "@/views/Debug.vue";
import Chat from "@/views/Chat.vue";
import ChatRoom from "@/views/ChatRoom.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
      },
      {
        path: "/about",
        name: "About",
        component: About,
      },
      {
        path: "/",
        component: MemberArea,
        children: [
          {
            path: "/chat",
            name: "Chat",
            component: Chat,
          },
          {
            path: "/chat/:roomId",
            name: "ChatRoom",
            component: ChatRoom,
          },
        ],
      },
      {
        path: "/debug",
        name: "Debug",
        component: Debug,
      },
      {
        path: "/account",
        name: "Account",
        component: Account,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

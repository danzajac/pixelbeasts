import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import store from "./store";

declare global {
  interface Window {
    ethereum: any;
  }
}

createApp(App).use(store).use(router).mount("#app");

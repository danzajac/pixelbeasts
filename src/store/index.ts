import { createStore } from "vuex";

export default createStore({
  state: {
    account: undefined,
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
  },
  getters: {
    isSiginedIn: (state) => {
      return state.account !== null && state.account !== undefined;
    },
  },
  actions: {},
  modules: {},
});

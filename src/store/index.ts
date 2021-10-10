import { createStore } from "vuex";

export default createStore({
  state: {
    account: undefined,
    user: undefined,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
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

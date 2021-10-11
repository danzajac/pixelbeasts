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
      return state.user !== null && state.user !== undefined;
    },
  },
  actions: {},
  modules: {},
});

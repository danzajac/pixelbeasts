import { createStore } from "vuex";

export default createStore({
  state: {
    account: undefined,
    user: undefined,
    assets: undefined,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setAccount(state, account) {
      state.account = account;
    },
    setAssets(state, assets) {
      state.assets = assets;
    }
  },
  getters: {
    isSiginedIn: (state) => {
      return state.user !== null && state.user !== undefined;
    },
  },
  actions: {},
  modules: {},
});

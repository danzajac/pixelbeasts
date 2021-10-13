import { createStore } from "vuex";

export default createStore({
  state: {
    account: undefined,
    user: undefined,
    assets: [],
    assetIndex: 0
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
    },
    setAssetIndex(state, index) {
      state.assetIndex = index;
    }
  },
  getters: {
    isSiginedIn: (state) => {
      return state.user !== null && state.user !== undefined;
    },
    asset: (state) => {
      if (state.assets.length > state.assetIndex) {
        return state.assets[state.assetIndex];
      }
      return null;
    }
  },
  actions: {},
  modules: {},
});

import { createStore } from "vuex";
import { auth, functions } from "../utils/firebase";

export default createStore({
  state: {
    account: undefined,
    user: undefined,
    assets: [],
    assetIndex: 0,
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
      if (state.user && state.assets.length > state.assetIndex) {
        const asset = state.assets[state.assetIndex];
        const selectNFT = functions.httpsCallable("selectNFT");
        const tokenId = asset["token_id"];
        console.log("selectNFT", tokenId);
        selectNFT({
          account: state.account,
          collectionId: "beastopia-pixelbeasts",
          tokenId,
        }).then((result) => {
          // console.log(result.data);
          auth.currentUser?.getIdToken(true).then((result) => {
            console.log(result);
          });
        });
      }
    },
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
    },
    haveAssets: (state) => {
      console.log(state.assets);
      return state.assets.length > 0;
    },
  },
  actions: {},
  modules: {},
});

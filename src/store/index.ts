import firebase from "firebase/app";

import { createStore } from "vuex";
import { auth, functions } from "../utils/firebase";

import Asset from "@/models/asset";

interface State {
  account: undefined | null | string;
  user:  undefined | null | firebase.User;
  assets: Asset[];
  assetIndex: number;
  currentAsset: Asset | null;
}

export default createStore<State>({
  state: {
    account: undefined,
    user: undefined,
    assets: [],
    assetIndex: 0,
    currentAsset: null,
  },
  mutations: {
    setUser(state: State, user: firebase.User | null) {
      state.user = user;
    },
    setAccount(state: State, account) {
      state.account = account;
    },
    setAssets(state: State, assets: Asset[]) {
      state.assets = assets;
      if (state.assets.length > state.assetIndex) {
        state.currentAsset = state.assets[state.assetIndex];
      }
    },
    setAssetIndex(state: State, index: number) {
      state.assetIndex = index;
      if (state.assets.length > state.assetIndex) {
        state.currentAsset = state.assets[state.assetIndex];
        if (state.user) {
          const selectNFT = functions.httpsCallable("selectNFT");
          const tokenId = state.currentAsset.data.token_id;
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
      }
    },
  },
  getters: {
    isSiginedIn: (state: State): boolean  => {
      return state.user !== null && state.user !== undefined;
    },
    asset: (state: State): Asset | null => {
      if (state.currentAsset) {
        return state.currentAsset;
      }
      return null;
    },
    assetTokenId: (state: State): string | null => {
      if (state.currentAsset) {
        return state.currentAsset.data.token_id;
      }
      return null;
    },
    assetCollectionId: (state: State): string | null => {
      if (state.currentAsset) {
        console.log(state.currentAsset.data.collection);
        return state.currentAsset.data.collection.slug;
      }
      return null;
    },
    assetName: (state: State): string | null => {
      if (state.currentAsset) {
        return state.currentAsset.data.name;
      }
      return null;
    },
    haveAssets: (state: State): boolean => {
      return state.assets.length > 0;
    },
  },
  actions: {},
  modules: {},
});

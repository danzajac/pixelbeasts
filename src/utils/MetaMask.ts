import firebase from "firebase/app";

export const ethereum = window.ethereum;
export const hasMetaMask = (typeof ethereum !== 'undefined' && ethereum.isMetaMask);

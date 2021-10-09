import firebase from "firebase/app";

export const hasMetaMask = (typeof window.ethereum !== 'undefined');
export const ethereum = window.ethereum;
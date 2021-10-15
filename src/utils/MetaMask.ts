import firebase from "firebase/app";

export const ethereum = window.ethereum;
export const hasMetaMask =
  typeof ethereum !== "undefined" && ethereum.isMetaMask;

export const requestAccount = async () => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  return accounts.length > 0 ? accounts[0] : null;
};

export const getAccount = async () => {
  const accounts = await ethereum.request({ method: "eth_accounts" });
  return accounts.length > 0 ? accounts[0] : null;
};

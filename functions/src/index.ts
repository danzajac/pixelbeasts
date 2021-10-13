import * as functions from "firebase-functions";
import * as util from "ethereumjs-util";
import * as admin from "firebase-admin";
import {fetchAsset} from "./opensea";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const debug1 = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("failed-precondition",
        "The function must be called while authenticated.");
  }
  const tokenId = data.tokenId;
  if (!tokenId) {
    throw new functions.https.HttpsError("failed-precondition",
        "The function requires tokenId.");
  }
  const asset = await fetchAsset(context.auth.uid, tokenId,
      "beastopia-pixelbeasts");
  if (!asset || asset.token_id != tokenId) {
    throw new functions.https.HttpsError("failed-precondition",
        "Invalid tokenId.");
  }
  console.log("debug1 asset", asset.name, asset.token_id,
      asset.collection.name);
  return {uid: context.auth.uid, asset};
});

// The user will see this message when MetaMask makes a "Signature Request"
// to the user.
const readableMessage = "PixelBeasts needs to verify your identity. " +
                "Please sign this message. \n";

export const generateNonce = functions.https.onCall(async (data, context) => {
  const refNonces = db.collection("nonces");
  const newData = {
    account: data.account,
    created: admin.firestore.FieldValue.serverTimestamp(),
  };
  const refDoc = await refNonces.add(newData);
  const uuid = refDoc.id;
  return {nonce: readableMessage + uuid, uuid};
});

export const deleteNonce = functions.https.onCall(async (data, context) => {
  const account = data.account;
  const uuid = data.uuid;
  const refNonce = db.collection("nonces").doc(uuid);
  const doc = await refNonce.get();
  const result = doc.data();
  if (result?.account != account) {
    return {"error": "no nonce in the database"};
  }
  await refNonce.delete();
  return {"success": true};
});

export const verifyNonce = functions.https.onCall(async (data, context) => {
  const signature = data.signature;
  const account = data.account;
  const uuid = data.uuid;
  const refNonce = db.collection("nonces").doc(uuid);
  const doc = await refNonce.get();
  const result = doc.data();
  if (result?.account != account) {
    return {"error": "no nonce in the database"};
  }
  await refNonce.delete();
  const message = readableMessage + uuid;
  const nonce = "\x19Ethereum Signed Message:\n" + message.length + message;
  const nonceBuffer = util.keccak(Buffer.from(nonce, "utf-8"));
  const {v, r, s} = util.fromRpcSig(signature);
  const pubKey = util.ecrecover(util.toBuffer(nonceBuffer), v, r, s);
  const addrBuf = util.pubToAddress(pubKey);
  const addr = util.bufferToHex(addrBuf);
  if (account == addr) {
    const auth = admin.auth();
    const token = await auth.createCustomToken(account);
    return {token};
  } else {
    return {"error": "mismatch"};
  }
});

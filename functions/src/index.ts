import * as functions from "firebase-functions";
import * as util from "ethereumjs-util";
import * as admin from "firebase-admin";
import { validateNFT } from "./lib/utils";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const auth = admin.auth();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const debug1 = functions.https.onCall(async (data, context) => {
  const { uid, collectionId, tokenId } = await validateNFT(
    context,
    "beastopia-pixelbeasts",
    data.tokenId
  );
  const token = context.auth?.token;
  console.log("### debug1", token?.collectionId, token?.tokenId, uid);
  return {
    uid,
    collectionId,
    tokenId,
    token,
    flag: data.tokenId == token?.tokenId,
  };
});

export const selectNFT = functions.https.onCall(async (data, context) => {
  const { uid, collectionId, tokenId, name } = await validateNFT(
    context,
    data.collectionId,
    data.tokenId
  );
  const refAccount = db.doc(`accounts/${uid}`);
  await refAccount.set({
    collectionId,
    tokenId,
    selected: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("### selectNFT 1", collectionId, tokenId, uid);
  await auth.setCustomUserClaims(uid, { collectionId, tokenId, name });
  const updated = await admin.auth().getUser(uid);
  console.log("### selectNFT 2", updated.customClaims);
  return { uid, collectionId, tokenId };
});

/*
export const accountUpdated = functions.firestore.document("/accounts/{uid}")
    .onWrite(async (change, context) => {
      const uid = context.params.uid;
      const data = change.after.data();
      console.log("accountUpdated", data);
      await auth.setCustomUserClaims(uid,
          {collectionId: data?.collectionId, tokenId: data?.tokenId});
    });
*/

// The user will see this message when MetaMask makes a "Signature Request"
// to the user.
const readableMessage =
  "PixelBeasts needs to verify your identity. " +
  "Please sign this message. \n";

export const generateNonce = functions.https.onCall(async (data, context) => {
  const refNonces = db.collection("nonces");
  const newData = {
    account: data.account,
    created: admin.firestore.FieldValue.serverTimestamp(),
  };
  const refDoc = await refNonces.add(newData);
  const uuid = refDoc.id;
  return { nonce: readableMessage + uuid, uuid };
});

export const deleteNonce = functions.https.onCall(async (data, context) => {
  const account = data.account;
  const uuid = data.uuid;
  const refNonce = db.collection("nonces").doc(uuid);
  const nonceDoc = await refNonce.get();
  const nonceData = nonceDoc.data();
  if (nonceData?.account != account) {
    return { error: "no nonce in the database" };
  }
  await refNonce.delete();
  return { success: true };
});

export const verifyNonce = functions.https.onCall(async (data, context) => {
  const signature = data.signature;
  const uuid = data.uuid;
  const message = readableMessage + uuid;
  const nonce = "\x19Ethereum Signed Message:\n" + message.length + message;
  const nonceBuffer = util.keccak(Buffer.from(nonce, "utf-8"));
  const { v, r, s } = util.fromRpcSig(signature);
  const pubKey = util.ecrecover(util.toBuffer(nonceBuffer), v, r, s);
  const addrBuf = util.pubToAddress(pubKey);
  const account = util.bufferToHex(addrBuf);

  const refNonce = db.collection("nonces").doc(uuid);
  const nonceDoc = await refNonce.get();
  const nonceData = nonceDoc.data();
  await refNonce.delete();
  if (nonceData?.account != account) {
    return { error: "no nonce in the database" };
  }

  const auth = admin.auth();
  const token = await auth.createCustomToken(account);
  return { token };
});

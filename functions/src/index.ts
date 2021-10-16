import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { validateNFT } from "./lib/utils";

import exportIfNeeded from "./lib/exportifneeded";

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

exportIfNeeded("verifyNonce", "verifyNonce", exports);
exportIfNeeded("generateNonce", "generateNonce", exports);

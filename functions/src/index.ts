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

exportIfNeeded("verifyNonce", "nonces/verifyNonce", exports);
exportIfNeeded("generateNonce", "nonces/generateNonce", exports);
exportIfNeeded("deleteNonce", "nonces/deleteNonce", exports);

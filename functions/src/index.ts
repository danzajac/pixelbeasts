import * as admin from "firebase-admin";

import exportIfNeeded from "./lib/exportifneeded";

if (!admin.apps.length) {
  admin.initializeApp();
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exportIfNeeded("verifyNonce", "nonces/verifyNonce", exports);
exportIfNeeded("generateNonce", "nonces/generateNonce", exports);
exportIfNeeded("deleteNonce", "nonces/deleteNonce", exports);

exportIfNeeded("selectNFT", "selectNFT", exports);
exportIfNeeded("debug1", "debug1", exports);

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

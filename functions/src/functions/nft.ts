import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { validateNFT } from "../lib/utils";

const db = admin.firestore();
const auth = admin.auth();

export const debug1 = async (
  data: { tokenId: string },
  context: functions.https.CallableContext
) => {
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
};

export const selectNFT = async (
  data: { collectionId: string; tokenId: string },
  context: functions.https.CallableContext
) => {
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
};

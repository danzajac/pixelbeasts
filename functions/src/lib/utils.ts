import * as functions from "firebase-functions";
import {fetchAsset} from "./opensea";

export const validateAuth = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("failed-precondition",
        "The function must be called while authenticated.");
  }
  return context.auth.uid;
};

export const validateNFT = async (context: functions.https.CallableContext,
    collectinoId: string, tokenId: string) => {
  const uid = validateAuth(context);
  if (!tokenId) {
    throw new functions.https.HttpsError("failed-precondition",
        "The function requires tokenId.");
  }
  const asset = await fetchAsset(uid, collectinoId, tokenId);
  if (!asset || asset.token_id != tokenId) {
    throw new functions.https.HttpsError("failed-precondition",
        "Invalid tokenId.");
  }
  return {uid, tokenId};
};

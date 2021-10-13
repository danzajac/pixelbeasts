import * as functions from "firebase-functions";

export const validateAuth = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("failed-precondition",
        "The function must be called while authenticated.");
  }
  return context.auth.uid;
};

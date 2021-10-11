import * as functions from "firebase-functions";
import * as util from "ethereumjs-util";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}
// const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

const readableMessage = "PixelBeasts needs to verify your identity." +
                "Please sign this message.";

export const generateNonce = functions.https.onCall((data, context) => {
  const uuid = "#abcdefg";
  return {nonce: readableMessage + uuid, uuid};
});

export const verifyNonce = functions.https.onCall(async (data, context) => {
  const signature = data.signature;
  const account = data.account;
  const message = data.nonce; // debug only
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

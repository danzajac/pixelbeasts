import * as functions from "firebase-functions";
import * as util from "ethereumjs-util";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

const message = "PixelBeasts needs to verify your identity." +
                "Please sign this message.";

export const generateNonce = functions.https.onCall((data, context) => {
  return {nonce: message};
});

export const verifyNonce = functions.https.onCall((data, context) => {
  const signature = data.signiture;
  const account = data.account;
  const nonce = "\x19Ethereum Signed Message:\n" + message.length + message;
  const nonceBuffer = util.keccak(Buffer.from(nonce, "utf-8"));
  const {v, r, s} = util.fromRpcSig(signature);
  const pubKey = util.ecrecover(util.toBuffer(nonceBuffer), v, r, s);
  const addrBuf = util.pubToAddress(pubKey);
  const addr = util.bufferToHex(addrBuf);
  return {account, addr};
});

import * as functions from "firebase-functions";

import { debug1 } from "../functions/nft";

export default functions.https.onCall(async (data, context) => {
  return await debug1(data, context);
});

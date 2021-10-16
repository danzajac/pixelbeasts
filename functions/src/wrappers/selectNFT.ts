import * as functions from "firebase-functions";

import { selectNFT } from "../functions/nft";

export default functions.https.onCall(async (data, context) => {
  return await selectNFT(data, context);
});

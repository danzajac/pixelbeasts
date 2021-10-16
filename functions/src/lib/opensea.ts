import { request } from "./netutils";

export const fetchAsset = async (
  account: string,
  collection: string,
  tokenId: string
) => {
  const params: Record<string, string> = {
    owner: account,
    order_direction: "desc",
    offset: String(0),
    limit: String(40),
    collection,
    token_ids: tokenId,
  };
  const query = Object.keys(params).map((key) => {
    return key + "=" + encodeURIComponent(params[key]);
  });
  const url = "https://api.opensea.io/api/v1/assets?" + query.join("&");
  console.log("fetchAsset url", url);
  const json = await request(url, {});
  const assets = json["assets"];
  console.log("fetchAsset assets.count", assets.length);
  return assets.length > 0 ? assets[0] : null;
};

// This source file is copied from the web to functions.
import { AssetData } from "../models/asset";
import Asset from "../models/asset";

import { request } from "../lib/netutils";

// https://docs.opensea.io/reference/api-overview

export const fetchAssets = async (
  account: string,
  collection: string | null,
  tokenId: string | null,
): Promise<Asset[]> => {
  const params: Record<string, string> = {
    owner: String(account),
    order_direction: "desc",
    offset: String(0),
    limit: String(40),
  };
  if (collection) {
    params.collection = collection;
  }
  if (tokenId) {
    params.token_ids = tokenId;
  }
  const query = Object.keys(params).map((key) => {
    return key + "=" + encodeURIComponent(params[key]);
  });
  const url = "https://api.opensea.io/api/v1/assets?" + query.join("&");
  const json = await request(url, {});
  const assetsData = json["assets"] as AssetData[];
  const assets = assetsData.map(data => new Asset(data))
  console.log(assets);
  return assets;
};

export const fetchAsset = async (
  account: string,
  collection: string ,
  tokenId: string,
): Promise<Asset|null> => {
  const assets = await fetchAssets(account, collection, tokenId);
  console.log("fetchAsset assets.count", assets.length);
  return assets.length > 0 ? assets[0] : null;
}

// This source file is copied from the web to functions.
import { AssetData } from "@/models/asset";
import Asset from "@/models/asset";

import { request } from "./netutils";

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
    params.colllection = collection;
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

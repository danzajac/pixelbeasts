import { AssetData } from "@/models/asset";
import Asset from "@/models/asset";

export const fetchAssets = async (account: string, collection: string): Promise<Asset[]> => {
  const params: Record<string, string> = {
    owner: String(account),
    offset: String(0),
    limit: String(40),
    collection: collection,
    order_direction: "desc", // eslint-disable-line @typescript-eslint/camelcase
  };
  const query = Object.keys(params).map((key) => {
    return key + "=" + encodeURIComponent(params[key]);
  });
  const url = "https://api.opensea.io/api/v1/assets?" + query.join("&");
  const result = await fetch(url);
  const json = await result.json();
  const assetsData = json["assets"] as AssetData[];
  const assets = assetsData.map(data => new Asset(data))
  console.log(assets);
  return assets;
};

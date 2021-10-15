export const fetchAssets = async (account: string, collection: string) => {
  const params: Record<string, string> = {
    owner: String(account),
    offset: String(0),
    limit: String(40),
    collection: collection,
  };
  params["order_direction"] = "desc"; // work around strict lint
  const query = Object.keys(params).map((key) => {
    return key + "=" + encodeURIComponent(params[key]);
  });
  const url = "https://api.opensea.io/api/v1/assets?" + query.join("&");
  const result = await fetch(url);
  const json = await result.json();
  const assets = json["assets"];
  return assets;
};

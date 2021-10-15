export interface AssetData {
  token_id: string;
}
export default class Asset {
  data: AssetData

  constructor(_data: AssetData) {
    this.data = _data;
  }

  tokenId() {
    return this.data.token_id;
  }
}

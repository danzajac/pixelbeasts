export interface AssetData {
  token_id: string;
  image_thumbnail_url: string;
  name: string;
}
export default class Asset {
  data: AssetData;
  
  constructor(_data: AssetData) {
    this.data = _data;
  }

}

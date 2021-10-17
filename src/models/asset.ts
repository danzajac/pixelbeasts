export interface CollectionData {
  slug: string;
}
export interface AssetData {
  token_id: string;
  image_thumbnail_url: string;
  name: string;
  collection: CollectionData;
}
export default class Asset {
  data: AssetData;
  
  constructor(_data: AssetData) {
    this.data = _data;
  }
}

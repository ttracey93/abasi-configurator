import Service from './Service';
import { DB, Storage } from '../firebase';

class AssetService extends Service {
  constructor() {
    super();
    this.clear();
    this.getAssets();
  }

  clear() {
    this.assets = {};
  }

  loadAssetsFromSnapshot(snapshot) {
    snapshot.forEach((doc) => {
      const asset = doc.data();
      asset.id = doc.id;
      this.assets[asset.id] = asset;
    });
  }

  async getAssets() {
    const snapshot = await DB.collection('assets').get();
    this.loadAssetsFromSnapshot(snapshot);
  }

  async getAll() {
    const { assets } = this;

    if (!assets || !assets.length) {
      await this.getAssets();
      return this.assets;
    }
  }

  async get(id) {
    let asset = this.assets[id];

    if (!asset) {
      const doc = await DB.collection('assets').doc(id).get();
      asset = doc.data();
      asset.id = id;
      this.assets[id] = asset;
    }
    
    return asset;
  }

  async upload(assetName, asset) {
    console.log(asset);

    const assetData = {
      name: assetName,
      size: asset.size,
    }

    await DB.collection('assets').doc().set(assetData);

    console.log('successfully saved asset to database...');

    const child = Storage.ref().child(assetName);
    await child.put(asset);
  }

  async delete(id) {

  }
}

export default new AssetService();
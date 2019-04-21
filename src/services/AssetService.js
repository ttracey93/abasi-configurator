import Service from './Service';
import { Storage } from '../firebase';

class AssetService extends Service {
  constructor() {
    super();
    this.clear();
  }

  clear() {
    this.assets = {};
  }

  async getTextureMetadata() {
    const ref = Storage.ref('textures');
    return await ref.getMetadata();
  }

  async getModelMetadata() {
    const ref = Storage.ref('models');
    return await ref.getMetadata();
  }
}

export default new AssetService();
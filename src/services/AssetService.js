import Service from './Service';
import uuid from 'uuid';
import { DB, Storage } from '../firebase';

class AssetService extends Service {
  constructor() {
    super();
    this.clear();
  }

  clear() {
    this.assets = {};
    this.modelMetadata = [];
    this.textureMetadata = [];
  }

  async createModel(filename, size) {
    const data = {
      id: uuid.v4().replace(/-/g, ''),
      filename: filename,
      size: size,
    };

    await DB.collection('models').doc(data.id).set(data);
  }

  async createTexture(filename, size) {
    const data = {
      id: uuid.v4().replace(/-/g, ''),
      filename: filename,
      size: size,
    };

    await DB.collection('textures').doc(data.id).set(data);
  }

  async getModelMetadata() {
    const { modelMetadata } = this;

    if (modelMetadata && modelMetadata.length) {
      return modelMetadata;
    }

    const snapshot = await DB.collection('models').get();
    snapshot.forEach((doc) => {
      const model = doc.data();
      model.id = doc.id;
      this.modelMetadata.push(model);
    });

    return this.modelMetadata;
  }

  async getTextureMetadata() {
    const { textureMetadata } = this;

    if (textureMetadata && textureMetadata.length) {
      return textureMetadata;
    }

    const snapshot = await DB.collection('textures').get();
    snapshot.forEach((doc) => {
      const texture = doc.data();
      texture.id = doc.id;
      this.textureMetadata.push(texture);
    });

    return this.textureMetadata;
  }

  async removeTexture(texture) {
    await DB.collection('textures').doc(texture).delete();
  }

  async removeModel(model) {
    await DB.collection('models').doc(model).delete();    
  }
}

export default new AssetService();
import Service from './Service';
import uuid from 'uuid';
import { DB, Storage } from '../firebase';

class AssetService extends Service {
  constructor() {
    super();
  }

  async createModel(filename, size, location) {
    const data = {
      id: uuid.v4().replace(/-/g, ''),
      filename,
      size,
      location,
    };

    await DB.collection('models').doc(data.id).set(data);
  }

  async createTexture(filename, size, location) {
    const data = {
      id: uuid.v4().replace(/-/g, ''),
      filename,
      location,
      size,
    };

    await DB.collection('textures').doc(data.id).set(data);
  }

  async getModelMetadata() {
    const modelMetadata = [];

    const snapshot = await DB.collection('models').get();
    snapshot.forEach((doc) => {
      const model = doc.data();
      model.id = doc.id;
      modelMetadata.push(model);
    });

    return modelMetadata;
  }

  async getTextureMetadata() {
    const textureMetadata = [];

    const snapshot = await DB.collection('textures').get();
    snapshot.forEach((doc) => {
      const texture = doc.data();
      texture.id = doc.id;
      textureMetadata.push(texture);
    });

    return textureMetadata;
  }

  async removeTexture(texture) {
    await DB.collection('textures').doc(texture).delete();
  }

  async removeModel(model) {
    await DB.collection('models').doc(model).delete();    
  }
}

export default new AssetService();
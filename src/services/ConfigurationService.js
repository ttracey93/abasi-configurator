import Service from './Service';
import { DB } from '../firebase';
import _ from 'lodash';
import uuid from 'uuid';

class ConfigurationService extends Service {
  constructor() {
    super();
  }

  loadConfigFromSnapshot(snapshot) {
    const configs = [];

    snapshot.forEach((doc) => {
      const config = doc.data();
      config.id = doc.id;
      configs.push(config);
    });

    return configs;
  }

  async getConfig() {
    const snapshot = await DB.collection('configuration').get();
    return this.loadConfigFromSnapshot(snapshot);
  }

  async getAll() {
    return this.getConfig();
  }

  async get(id) {
    const doc = await DB.collection('configuration').doc(id).get();
    const config = doc.data();
    config.id = id;
    return config;
  }

  async create(data) {
    if (data.id && typeof data.id === 'string' && data.id !== '') {
      await DB.collection('configuration').doc(data.id).set(data);
      this.config = _.filter(this.config, c => c.id !== data.id);
    }

    delete data.id;
    await DB.collection('configuration').doc().set(data);
  }

  async saveAll(configs) {
    try {
      _.each(configs, async c => {
        await DB.collection('configuration').doc(c.id).set(c);
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  createLineitem(config, item) {
    item.id = uuid.v4().replace(/-/g, '');

    if (config.options && config.options.length) {
      config.options.push(item);
    } else {
      config.options = [item];
    }
  }

  async delete(id) {
    await DB.collection('configuration').doc(id).delete();
  }
}

export default new ConfigurationService();
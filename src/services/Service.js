import Axios from 'axios';

const SERVICE_BASE = 'http://localhost:3001';

class Service {
  getUrl(path) {
    return `${SERVICE_BASE}/${path}`;
  }

  async get(path) {
    return Axios.get(this.getUrl(path));
  }

  // Could potentially become useful
  // async getWithParams(path, params) {
  //   return Axios.get(this.getUrl(path), {
  //     params,
  //   });
  // }

  async post(path, query) {
    return Axios.post(this.getUrl(path), query);
  }
}

export default Service;
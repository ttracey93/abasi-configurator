import Service from './Service';
import { DB } from '../firebase';

class OrderService extends Service {
  constructor() {
    super();
    this.clear();
    this.getOrders();
  }

  clear() {
    this.orders = {};
  }

  loadOrdersFromSnapshot(snapshot) {
    snapshot.forEach((doc) => {
      const order = doc.data();
      order.id = doc.id;
      this.orders[order.id] = order;
    });
  }

  async getOrders() {
    const snapshot = await DB.collection('orders').get();
    this.loadOrdersFromSnapshot(snapshot);
  }

  async getAll() {
    const { orders } = this;

    if (!orders || !orders.length) {
      await this.getOrders();
      return this.orders;
    }
  }

  async get(id) {
    let order = this.orders[id];

    if (!order) {
      const doc = await DB.collection('orders').doc(id).get();
      order = doc.data();
      order.id = id;
      this.orders[id] = order;
    }
    
    return order;
  }
}

export default new OrderService();
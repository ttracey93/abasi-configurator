import Service from './Service';
import { DB } from '../firebase';
import _ from 'lodash';

class OrderService extends Service {
  constructor() {
    super();
  }

  loadOrdersFromSnapshot(snapshot) {
    const orders = [];

    snapshot.forEach((doc) => {
      const order = doc.data();
      order.id = doc.id;
      orders.push(order);
    });

    return orders;
  }

  async getOrders() {
    const snapshot = await DB.collection('orders').get();
    return this.loadOrdersFromSnapshot(snapshot);
  }

  async getAll() {
    return this.getOrders();
  }

  async get(id) {
    const doc = await DB.collection('orders').doc(id).get();
    const order = doc.data();
    order.id = id;
    return order;
  }

  async updateNotes(order) {
    await DB.collection('orders').doc(order.id).set(order);
  }
}

export default new OrderService();
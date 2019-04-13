import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import OrderService from '../../services/OrderService';

class Orders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: null,
    };

    this.getOrders();
  }

  async getOrders() {
    const orders = await OrderService.getAll();

    this.setState({
      orders,
    });
  }

  getOrderContent(order) {
    return (
      <tr className="abasi-orders-row">
        <td>{ order.orderNumber }</td>
        <td>{ order.id }</td>
        <td>${ order.total }</td>
        <td>{ order.status }</td>

        <td>
          <Link to={`/orders/${order.id}`}>
            View Order
          </Link>
        </td>
      </tr>
    );
  }

  render() {
    const { orders } = this.state;

    if (orders ) {
      const orderContent = _.map(this.state.orders, this.getOrderContent);
  
      return (
        <div className="abasi-orders flex columns">
          <span className="abasi-orders-header">
            Orders
          </span>
    
          <table className="abasi-orders-table abasi-table" border="1" frame="void" rules="rows">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Invoice ID</th>
                <th>Total</th>
                <th>Payment Status</th>
                <th>Order Link</th>
              </tr>
            </thead>
    
            <tbody>
              { orderContent &&
                orderContent
              }
  
              { !orderContent &&
                <p>No orders yet!</p>
              }
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        'Waiting on Orders'
      );
    }
  }
}

export default Orders;

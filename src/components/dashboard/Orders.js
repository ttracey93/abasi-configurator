import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import DataTable from 'react-data-table-component';

import OrderService from '../../services/OrderService';

class Orders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: null,
    };
  }

  componentDidMount() {
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
      <tr className="abasi-orders-row" key={order.id}>
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

  getDefaultContent() {
    return (
      <div className="flex columns abasi-orders-spinner">
        <h1>Retrieving Orders</h1>
        <ClipLoader />
      </div>
    );
  }

  getOrdersContent(orders) {
    const columns = [{
      name: '#',
      selector: 'orderNumber',
      sortable: true,
    },
    {
      name: 'Invoice ID',
      selector: 'id',
    }, {
      name: 'Total',
      selector: 'total',
      sortable: true,
    }, {
      name: 'Status',
      selector: 'status',
      sortable: true,
    }, {
      name: 'Link',
      cell: row => <Link to={`/orders/${row.id}`}>View Order</Link>
    }];

    return (
      <div className="abasi-orders flex columns">
        <span className="abasi-orders-header">
          Orders
        </span>
        
        <div className="abasi-orders-table flex">
          <DataTable
            columns={columns}
            data={orders}
            highlightOnHover
          />
        </div>
      </div>
    );
  }

  render() {
    const { orders } = this.state;

    if (orders) {
      return this.getOrdersContent(orders);
    }
    
    return this.getDefaultContent();
  }
}

export default Orders;

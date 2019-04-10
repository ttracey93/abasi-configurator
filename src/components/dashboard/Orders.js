import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

const orders = [{
  invoiceId: 117,
  total: '3,396.00',
  status: 'Paid in full',
}, {
  invoiceId: 118,
  total: '4,200.81',
  status: 'Canceled - Refund Required',
}, {
  invoiceId: 119,
  total: '3,396.71',
  status: 'Whatever',
}];

const getOrder = (order) => (
  <tr className="abasi-orders-row">
    <td>{ order.invoiceId }</td>
    <td>${ order.total }</td>
    <td>{ order.status }</td>

    <td>
      <Link to={`/orders/${order.invoiceId}`}>
        View Order
      </Link>
    </td>
  </tr>
);

const Orders = () => {
  const orderContent = _.map(orders, getOrder);

  return (
    <div className="abasi-orders flex columns">
      <span className="abasi-orders-header">
        Orders
      </span>

      <table className="abasi-orders-table abasi-table" border="1" frame="void" rules="rows">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Total</th>
            <th>Payment Status</th>
            <th>Order Link</th>
          </tr>
        </thead>

        <tbody>
          { orderContent }
        </tbody>
      </table>
    </div>
  );
};

export default Orders;

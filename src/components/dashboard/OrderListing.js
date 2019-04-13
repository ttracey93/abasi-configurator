import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import OrderService from '../../services/OrderService';

class OrderListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: null,
      pristineBuilderNotes: true,
    };

    this.handleBuilderNotes = this.handleBuilderNotes.bind(this);

    this.getOrder();
  }

  async getOrder() {
    console.log(this.props);
    const order = await OrderService.get(this.props.match.params.id);
    console.log(order);
    this.setState({
      order,
    });
  }

  handleBuilderNotes(event) {
    this.state.order.builderNotes = event.target.value;
    this.setState({
      pristineBuilderNotes: false,
    });

    // TODO: Save builder notes to firebase

    event.preventDefault();
  }

  getSpecs(specs) {
    return _.map(specs, (spec) => {
      return (
        <div className="spec">
          <span className="title">
            { spec.title }
          </span>

          <span className="price">
            ${ spec.price }
          </span>
        </div>
      );
    });
  }

  getPurchaserInfo(purchaser) {
    return (
      <div className="purchaser-info">
        <div className="item name">
          <span className="label">Purchaser Name:</span>
          <span className="value">{ purchaser.firstName } { purchaser.lastName }</span>
        </div>

        <div className="item email">
          <span className="label">Purchaser Email:</span>
          <span className="value">
            <a href={`mailto:${purchaser.email}`} className="purchaser-email-link">
              { purchaser.email }
            </a>
          </span>
        </div>

        <div className="item address">
          <span className="label">Purchaser Address:</span>
          <span className="value">{ purchaser.address.full }</span>
        </div>
      </div>
    );
  }

  getDefaultContent() {
    return (
      'Waiting!'
    );
  }

  getOrderContent(order, specs, purchaserInfo) {
    return (
      <div className="abasi-order-listing flex columns">
        <h1 className="order-header">
          Order #{order.orderNumber}
        </h1>

        <a target="_blank" href={order.configuratorUrl} className="configurator-link">
          Configurator Link
        </a>

        <div className="flex order-info-wrapper">
          <div className="order-info">
            <div className="item invoice">
              <span className="label">Invoice ID:</span>
              <span className="value">{order.id}</span>
            </div>

            <div className="item total">
              <span className="label">Total:</span>
              <span className="value">${order.total}</span>
            </div>

            <div className="item status">
              <span className="label">Order Status:</span>
              <span className="value">{order.status}</span>
            </div>

            <div className="item payment-type">
              <span className="label">Payment Type:</span>
              <span className="value">{order.paymentType}</span>
            </div>

            <div className="item stripe-id">
              <span className="label">Stripe Transaction:</span>
              <span className="value">
                <a href="strip.com" target="_blank" className="stripe-link">
                  {order.transactionId}
                </a>
              </span>
            </div>
          </div>

          { purchaserInfo }
        </div>

        <div className="flex builder-info-wrapper">
          <div className="specs">
            { specs }
          </div>

          <div className="builder-notes">
            <h1>Builder Notes</h1>
            <p>Notes about the order for internal use only.</p>
            <textarea value={order.builderNotes} onChange={this.handleBuilderNotes} />

            <button disabled={this.state.pristineBuilderNotes} className="builder-notes-save-button btn">
              Save
            </button>
          </div>
        </div>

        <div className="flex order-actions">
          <button disabled className="btn order-action delete">
            Delete Order
          </button>

          { order.paymentType === 'Deposit' &&
            <button className="btn order-action paid">
              Payment Complete
            </button>
          }

          <button className="btn order-action fulfill">
            Fulfill Order
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { order } = this.state;

    if (order) {
      const specs = this.getSpecs(order.specs);
      console.log(order);
      const purchaserInfo = this.getPurchaserInfo(order.purchaserInfo);

      return this.getOrderContent(order, specs, purchaserInfo);
    } else {
      return this.getDefaultContent(order);
    }
  }
}

OrderListing.propTypes = {
  match: PropTypes.object.isRequired,
};

export default OrderListing;
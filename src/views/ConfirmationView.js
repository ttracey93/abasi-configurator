import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// TODO: Viewport on confirmation page?
// import ViewPort from '../components/Viewport';

export default class ConfirmationView extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.checkout = this.checkout.bind(this);
  }

  handleChange(data) {
    this.props.setData(data);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  checkout() {
    window.open(this.props.checkout.webUrl);
  }

  render() {
    const lineItems = _.map(_.orderBy(this.props.checkout.lineItems, 'addedAt'), (lineItem, index) => (
      <div key={index}>
        {index + 1}: {lineItem.title} - {lineItem.variant.price}
      </div>
    ));

    return (
      <div className="container columns">
        <h1>Confirmation View</h1>

        {lineItems}

        <hr />

        <p>Total: ${this.props.checkout.totalPrice}</p>

        <hr />

        <p>This will take you to Shopify to pay for your guitar</p>
        <button className="btn checkout-button" onClick={this.checkout}>
          Checkout
        </button>
      </div>
    );
  }
}

ConfirmationView.propTypes = {
  reset: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  checkout: PropTypes.object.isRequired,
};

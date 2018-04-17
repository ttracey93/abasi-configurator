import React from 'react';
import PropTypes from 'prop-types';

import Client from 'shopify-buy';

// import ViewPort from '../widgets/Viewport';
import Menu from '../widgets/Menu';

export default class ConfirmationView extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.checkout = this.checkout.bind(this);

    this.client = Client.buildClient({
      domain: 'tyify.myshopify.com',
      storefrontAccessToken: '4100223db918b0a9731e5ddfa63e014c',
    });
  }

  handleChange(data) {
    this.props.setData(data);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  async checkout() {
    const checkout = await this.client.checkout.create();
    console.log(checkout);

    checkout.note = this.props.data;
    console.log(checkout);
  }

  render() {
    return (
      <div className="container columns">
        <p>Dis da conf winder</p>

        <button onClick={this.checkout}>
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
  setItems: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

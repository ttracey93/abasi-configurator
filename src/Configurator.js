import React from 'react';
import Client from 'shopify-buy';

import Strings from './constants/strings';
import Scale from './constants/scale';
import Headstyle from './constants/headstyle';
import Modes from './constants/modes';

import './Configurator.css';

import HomeView from './components/HomeView';
import OptionView from './components/OptionView';
import ConfirmationView from './components/ConfirmationView';
import PaymentView from './components/PaymentView';

import Options from './constants/options-wizard.json';

export default class Configurator extends React.Component {
  static getInitialData() {
    return {
      strings: Strings.SIX,
      scale: Scale.STANDARD,
      headstyle: Headstyle.HEADSTOCK,
      price: 3259.69,
    };
  }

  constructor(props) {
    super(props);

    // Initial State
    this.state = {
      data: Configurator.getInitialData(),
      items: Options,
      itemIndex: 0,
      mode: Modes.HOME,
    };

    // Event bindings
    this.setData = this.setData.bind(this);
    this.getItems = this.getItems.bind(this);
    this.setItems = this.setItems.bind(this);
    this.goBack = this.goBack.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.reset = this.reset.bind(this);

    // Setup components to use for different views
    this.components = {
      [Modes.HOME]: HomeView,
      [Modes.OPTION]: OptionView,
      [Modes.CONFIRMATION]: ConfirmationView,
      [Modes.PAYMENT]: PaymentView,
    };

    // Setup Shopify Client
    this.client = Client.buildClient({
      domain: 'tyify.myshopify.com',
      storefrontAccessToken: '4100223db918b0a9731e5ddfa63e014c',
    });
    this.checkout = this.client.checkout.create();

    // Pull items from shopify API based on configuration
    this.propogateItems();
  }

  setData(data) {
    Object.assign(this.state.data, data);
    this.forceUpdate();
  }

  getItems() {
    return this.state.items[this.state.itemIndex];
  }

  // Reset guitar options
  reset() {
    this.setState({
      data: Configurator.getInitialData(),
    });
  }

  goBack() {
    this.state.itemIndex -= 1;

    if (this.state.itemIndex === 0) {
      this.setState({
        mode: Modes.HOME,
      });
    } else {
      this.forceUpdate();
    }

    this.propogateItems();
  }

  goForward() {
    this.state.itemIndex += 1;

    if (this.state.itemIndex !== 0) {
      this.setState({
        mode: Modes.OPTION,
      });
    } else {
      this.forceUpdate();
    }

    this.propogateItems();
  }

  changeMode(mode) {
    this.setState({
      mode,
    });
  }

  render() {
    const Component = this.components[this.state.mode];

    if (!Component) {
      throw new Error(`Component missing for mode ${this.state.mode}`);
    }

    return (
      <div className="configurator">
        <Component
          data={this.state.data}
          setData={this.setData}
          getItems={this.getItems}
          setItems={this.setItems}
          goBack={this.goBack}
          changeMode={this.changeMode}
          reset={this.reset}
        />
      </div>
    );
  }
}

import React from 'react';
import Client from 'shopify-buy';
import _ from 'lodash';

import Strings from './constants/strings';
import Scale from './constants/scale';
import Headstyle from './constants/headstyle';
import Modes from './constants/modes';

import './Configurator.css';

import HomeView from './components/HomeView';
import OptionView from './components/OptionView';
import ConfirmationView from './components/ConfirmationView';

import Options from './constants/options-wizard.json';

export default class Configurator extends React.Component {
  static getInitialData() {
    return {
      strings: Strings.SIX,
      scale: Scale.STANDARD,
      headstyle: Headstyle.HEADSTOCK,
      price: 0,
      itemIndex: 1,
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
      lineItems: [],
    };

    // Event bindings
    this.setData = this.setData.bind(this);
    this.getItems = this.getItems.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.reset = this.reset.bind(this);

    // Setup components to use for different views
    this.components = {
      [Modes.HOME]: HomeView,
      [Modes.OPTION]: OptionView,
      [Modes.CONFIRMATION]: ConfirmationView,
    };

    // Setup Shopify Client
    this.client = Client.buildClient({
      domain: 'tyify.myshopify.com',
      storefrontAccessToken: '4100223db918b0a9731e5ddfa63e014c',
    });
  }

  componentDidMount() {
    this.getShopifyData();
  }

  async setData(data) {
    console.log(data);

    const object = Object.values(data)[0];
    const variantId = object.variants[0].id;
    const lineItemsToAdd = [{
      variantId,
      quantity: 1,
    }];

    console.log(object.id);
    this.checkout = await this.client.checkout.addLineItems(this.checkout.id, lineItemsToAdd);
    this.state.lineItems.push(this.checkout.lineItems[this.checkout.lineItems.length - 1]);

    Object.assign(this.state.data, data);
    this.state.data.price = this.checkout.totalPrice;
    this.forceUpdate();
  }

  getItems() {
    return this.state.items[this.state.itemIndex];
  }

  /* eslint-disable guard-for-in */
  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */
  // Pull items from shopify API
  async getShopifyData() {
    this.checkout = await this.client.checkout.create();
    this.collections = await this.client.collection.fetchAllWithProducts();
    this.propogateItems();
  }

  propogateItems() {
    const item = this.state.items[this.state.itemIndex];

    // Grab products from shopify data
    const collection = _.find(this.collections, c => c.id === item.collectionId);

    // Place products on item
    this.state.items[this.state.itemIndex].products = _.orderBy(collection.products, 'createdAt');

    // Update
    this.forceUpdate();
  }

  // Reset guitar options
  reset() {
    this.setState({
      data: Configurator.getInitialData(),
    });
  }

  async goBack() {
    const lineItemsToRemove = [this.state.lineItems[this.state.lineItems.length - 1].id];
    this.state.lineItems.pop();

    console.log(lineItemsToRemove);

    try {
      this.checkout = await this.client.checkout.removeLineItems(
        this.checkout.id,
        lineItemsToRemove,
      );
    } catch (ex) {
      console.log(ex);
    }

    this.state.data.price = this.checkout.totalPrice;

    this.setState({
      itemIndex: this.state.itemIndex - 1,
    });
  }

  goForward() {
    const newIndex = this.state.itemIndex + 1;

    if (newIndex < this.state.items.length) {
      this.state.itemIndex = newIndex;
      this.propogateItems();
    } else {
      this.changeMode(Modes.CONFIRMATION);
    }
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
        {this.getItems().products &&
          <Component
            data={this.state.data}
            setData={this.setData}
            getItems={this.getItems}
            goBack={this.goBack}
            goForward={this.goForward}
            changeMode={this.changeMode}
            reset={this.reset}
            checkout={this.checkout}
            itemIndex={this.state.itemIndex}
          />
        }
      </div>
    );
  }
}

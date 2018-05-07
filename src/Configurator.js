import React from 'react';
import Client from 'shopify-buy';
import _ from 'lodash';

import Strings from './constants/strings';
import Scale from './constants/scale';
import Headstyle from './constants/headstyle';
import Modes from './constants/modes';

import './Configurator.css';

import HomeView from './views/HomeView';
import OptionView from './views/OptionView';
import ConfirmationView from './views/ConfirmationView';

// import Options from './constants/options.json';
import NewOptions from './constants/new-options.json';

export default class Configurator extends React.Component {
  static getInitialData() {
    return {
      strings: Strings.SIX,
      scale: Scale.STANDARD,
      headstyle: Headstyle.HEADSTOCK,
      price: 0,
    };
  }

  constructor(props) {
    super(props);

    // Initial State
    this.state = {
      data: Configurator.getInitialData(),
      items: [NewOptions],
      itemIndex: 0,
      mode: Modes.HOME,
      lineItems: {},
    };

    // Event bindings
    this.setData = this.setData.bind(this);
    this.getItems = this.getItems.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.reset = this.reset.bind(this);
    this.goBack = this.goBack.bind(this);

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
    // If menu selection, set items and change mode
    // Push items onto menu?
    if (data.collectionId) {
      console.log('This is a menu item');
      this.state.items.push(data);
      this.state.itemIndex += 1;
      this.propogateItems();
    } else if (data.collections) {
      this.state.items.push(data.collections);
      this.propogateItems();
    } else {
      // If product selection, deal with shopify
      console.log(data);

      const object = Object.values(data)[0];
      const variantId = object.variants[0].id;
      const lineItemsToAdd = [{
        variantId,
        quantity: 1,
      }];

      this.checkout = await this.client.checkout.addLineItems(this.checkout.id, lineItemsToAdd);
      this.state.lineItems[data.key] = this.checkout.lineItems[this.checkout.lineItems.length - 1];

      Object.assign(this.state.data, data);
      this.state.data.price = this.checkout.totalPrice;
      this.forceUpdate();
    }
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

    // If this is a collection and not a menu item
    if (collection) {
      // Place products on item
      this.state.items[this.state.itemIndex].products = _.orderBy(collection.products, 'createdAt');
    }

    // Update
    this.forceUpdate();
  }

  goBack() {
    console.log('Back');
  }

  // Reset guitar options
  reset() {
    this.setState({
      data: Configurator.getInitialData(),
    });
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
        {this.getItems() &&
          <Component
            data={this.state.data}
            setData={this.setData}
            getItems={this.getItems}
            changeMode={this.changeMode}
            reset={this.reset}
            checkout={this.checkout}
            itemIndex={this.state.itemIndex}
            goBack={this.goBack}
          />
        }
      </div>
    );
  }
}

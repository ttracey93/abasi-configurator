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

  componentWillMount() {
    this.getShopifyData();
  }

  async setData(data, key) {
    console.log(key);

    // If menu selection, set items and change mode
    // Push items onto menu?
    if (data.collectionId || data.collections) {
      this.state.mode = Modes.OPTION;
      this.state.items.push(data.collections || data);
      this.state.itemIndex += 1;
      this.propogateItems();
    } else {
      // If product selection, deal with shopify
      if (!key) {
        throw new Error('No item key supplied!');
      }

      // Prepare shopify data
      const variantId = data.variants[0].id;

      // Record accurate selection info by key in global state
      const { lineItems } = this.state;

      // If it exists, update cart?
      if (lineItems[key]) {
        if (!lineItems[key].lineItemId) {
          throw new Error('Changing existing selection with no Line Item ID!!');
        }

        const lineItemsToRemove = [lineItems[key].lineItemId];
        this.checkout = await this.client.checkout.removeLineItems(this.checkout.id, lineItemsToRemove);
      } else {
        lineItems[key] = {
          variantId,
        };
      }

      // Update state of shopify cart to reflect current selections
      const lineItemsToAdd = [{
        variantId,
        quantity: 1,
      }];

      this.checkout = await this.client.checkout.addLineItems(this.checkout.id, lineItemsToAdd);
      this.state.lineItems[key].lineItemId = this.checkout.lineItems[this.checkout.lineItems.length - 1].id;

      const dataCopy = { ...this.state.data };
      dataCopy[key] = data.handle;
      dataCopy.price = this.checkout.totalPrice;
      this.state.data = dataCopy;

      this.setState({
        data: dataCopy,
      });
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
    this.setState({
      items: this.state.items,
    });
  }

  goBack() {
    const itemIndex = this.state.itemIndex - 1;
    const mode = itemIndex === 0 ? Modes.HOME : Modes.OPTION;

    // Pop last menu set off
    this.state.items.pop();

    this.setState({
      itemIndex,
      mode,
    });
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
    // TODO: Pre-rendered components?
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

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

import Renderer from './components/Renderer';

// import Options from './constants/options.json';
import NewOptions from './constants/new-options.json';

export default class Configurator extends React.Component {
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

    this.renderer = new Renderer(this.state.data);
  }

  componentWillMount() {
    this.getShopifyData();
  }

  componentDidMount() {
    // Startup/attach renderer
    this.rendererContainer = document.getElementById('renderer-container');
    this.renderer.container = this.rendererContainer;

    // Initialize the scene if we haven't already done so
    if (!this.renderer.scene) {
      this.renderer.createScene();
    }

    this.rendererContainer.appendChild(this.renderer.getRendererElement());
  }

  componentDidUpdate() {
    // Update/re-attach renderer
    if (this.state.mode !== Modes.CONFIRMATION) {
      this.rendererContainer = document.getElementById('renderer-container');
      this.renderer.container = this.rendererContainer;
      this.renderer.resize();
      this.renderer.update(this.state.data);
      this.rendererContainer.appendChild(this.renderer.getRendererElement());
    }
  }

  static getInitialData() {
    return {
      strings: Strings.SIX,
      scale: Scale.STANDARD,
      headstyle: Headstyle.HEADSTOCK,
      price: '0.00',
    };
  }

  async setData(data, key) {
    // If menu selection, set items and change mode
    // Push items onto menu?
    if (data.collectionId || data.collections) {
      // this.state.mode = Modes.OPTION;
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

      // Create empty object if undefined
      lineItems[key] = lineItems[key] || {};
      lineItems[key].variantId = variantId;

      const dataCopy = { ...this.state.data };
      dataCopy[key] = data.handle;
      dataCopy.price = this.checkout.totalPrice;
      this.state.data = dataCopy;

      this.setState({
        data: dataCopy,
        lineItems,
      });

      this.updateCart();
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

  async initializeCart() {
    // Place checkout ID in localStorage
  }

  async emptyCart() {

  }

  async updateCart() {
    // Retrieve line items from state
    const { lineItems } = this.state;
    const shopifyLineItems = this.checkout.lineItems;

    // Reduce variantIds
    const variants = _.keys(_.groupBy(lineItems, 'variantId'));

    // Reduce shopify line items to variantIds
    const existingShopifyVariants = _.keys(_.groupBy(shopifyLineItems, 'variant.id'));

    // List of items NOT yet in cart
    const itemsToAdd = _.filter(variants, v => !_.includes(existingShopifyVariants, v));

    // List of items in cart that should NOT be
    const shopifyItemsToRemove = _.filter(shopifyLineItems, sli => !_.includes(variants, sli.variant.id));

    // Add missing items to shopify cart
    const lineItemsToAdd = [];
    _.each(itemsToAdd, (i) => {
      lineItemsToAdd.push({
        variantId: i,
        quantity: 1,
      });
    });

    this.checkout = await this.client.checkout.addLineItems(this.checkout.id, lineItemsToAdd);

    // Remove any excess items from shopify cart
    this.checkout = await this.client.checkout.removeLineItems(this.checkout.id, _.keys(_.groupBy(shopifyItemsToRemove, 'id')));

    const dataCopy = { ...this.state.data };
    dataCopy.price = this.checkout.totalPrice;

    this.setState({
      data: dataCopy,
    });
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
    if (this.state.itemIndex > 0) {
      const itemIndex = this.state.itemIndex - 1;
      // const mode = itemIndex === 0 ? Modes.HOME : Modes.OPTION;

      // Pop last menu set off
      this.state.items.pop();

      this.setState({
        itemIndex,
        // mode,
      });
    }
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
            renderer={this.renderer}
          />
        }
      </div>
    );
  }
}

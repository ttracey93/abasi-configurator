import React from 'react';
import _ from 'lodash';

// Constants
import Strings from '../constants/strings';
import Scale from '../constants/scale';
import Headstyle from '../constants/headstyle';
import Modes from '../constants/modes';
import SelectionTypes from '../constants/selection-types';
import NewOptions from '../constants/new-options.json';

// WebGL Renderer
import Renderer from './Renderer';

// Views
import HomeView from './views/HomeView';
import OptionView from './views/OptionView';
import PaymentView from './views/PaymentView';
import ConfirmationView from './views/ConfirmationView';
import ConfigurationService from '../services/ConfigurationService';

export default class Configurator extends React.Component {
  constructor(props) {
    super(props);

    // Initial State
    this.state = {
      items: [[]],
      mode: Modes.HOME,
      price: 0,
      selections: Configurator.getInitialData(),
    };

    // Event bindings
    this.getItems = this.getItems.bind(this);
    this.makeSelection = this.makeSelection.bind(this);
    this.propogateEvent = this.propogateEvent.bind(this);
    this.evaluatePrice = this.evaluatePrice.bind(this);

    // Setup components to use for different views
    this.components = {
      [Modes.HOME]: HomeView,
      [Modes.OPTION]: OptionView,
      [Modes.PAYMENT]: PaymentView,
      [Modes.CONFIRMATION]: ConfirmationView,
    };

    this.renderer = new Renderer(this.state.data);
  }

  async componentDidMount() {
    // Startup/attach renderer
    this.rendererContainer = document.getElementById('renderer-container');
    this.renderer.container = this.rendererContainer;

    // Initialize the scene if we haven't already done so
    if (!this.renderer.scene) {
      this.renderer.createScene();
    }

    this.rendererContainer.appendChild(this.renderer.getRendererElement());

    // Begin pricing module
    this.evaluatePrice();

    // Grab configuration items for the user menu
    const items = await ConfigurationService.getConfig();
    this.setState({
      items: [_.sortBy(items, 'position')],
    });
  }

  componentDidUpdate() {
    // Update/re-attach renderer
    if (this.state.mode !== Modes.CONFIRMATION) {
      this.rendererContainer = document.getElementById('renderer-container');
      this.renderer.container = this.rendererContainer;
      this.rendererContainer.appendChild(this.renderer.getRendererElement());
      this.renderer.resize();
      this.renderer.update(this.state.data);
    }
  }

  static getInitialData() {
    return {
      body: { price: 50 }
    };
  }

  async makeSelection(selection) {
    // console.log(selection);

    // switch (selection.type) {
    //   case SelectionTypes.MENU:
    //     // TODO: Push new items
    //     const { items } = this.state;
    //     items.push(selection.options);

    //     this.setState({
    //       items
    //     });
    //     break;
    //   case SelectionTypes.MODEL:
    //   case SelectionTypes.MATERIAL:
    //   case SelectionTypes.TEXTURE:
    //     // TODO: Create selection, update price, return to original options
    //     this.performUpdate(selection);
    //   default:
    //     console.log('Expected concrete selection type...');
    //     break;
    // }
  }

  async performUpdate(selection) {
    // const { selections } = this.state;
    // selections[selection.key] = selection;

    // this.setState({
    //   selections,
    // });

    this.evaluatePrice();
  }

  async evaluatePrice() {
    const price = _.map(this.state.selections, s => s.price).reduce((p, c) => p + c);
    this.setState({
      price,
    })
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

      const dataCopy = { ...this.state.data };
      dataCopy[key] = data.handle;
      this.state.data = dataCopy;

      this.setState({
        data: dataCopy,
      });

      this.updateCart();
    }
  }

  getItems() {
    return this.state.items[this.state.items.length - 1];
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
    // this.setState({
    //   data: Configurator.getInitialData(),
    // });
  }

  changeMode(mode) {
    this.setState({
      mode,
    });
  }

  propogateEvent(event) {
    // TODO: Event handler code for renderer events
    this.renderer.handleEvent(event, this.state.data);
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
            renderer={this.renderer}
            getItems={this.getItems}
            makeSelection={this.makeSelection}
            price={this.state.price}
          />
        }
      </div>
    );
  }
}

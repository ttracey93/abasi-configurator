import React from 'react';
import _ from 'lodash';

// Constants
import Strings from './constants/strings';
import Scale from './constants/scale';
import Headstyle from './constants/headstyle';
import Modes from './constants/modes';
import NewOptions from './constants/new-options.json';

// WebGL Renderer
import Renderer from './components/Renderer';

// Views
import HomeView from './views/HomeView';
import OptionView from './views/OptionView';
import PaymentView from './views/PaymentView';
import ConfirmationView from './views/ConfirmationView';

export default class Configurator extends React.Component {
  constructor(props) {
    super(props);

    // Initial State
    this.state = {
      data: Configurator.getInitialData(),
      items: [NewOptions],
      itemIndex: 0,
      mode: Modes.HOME,
    };

    // Event bindings
    this.setData = this.setData.bind(this);
    this.getItems = this.getItems.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.reset = this.reset.bind(this);
    this.goBack = this.goBack.bind(this);
    this.propogateEvent = this.propogateEvent.bind(this);

    // Setup components to use for different views
    this.components = {
      [Modes.HOME]: HomeView,
      [Modes.OPTION]: OptionView,
      [Modes.PAYMENT]: PaymentView,
      [Modes.CONFIRMATION]: ConfirmationView,
    };

    this.renderer = new Renderer(this.state.data);
  }

  componentWillMount() {
    // TODO: Do Stuff
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
    return this.state.items[this.state.itemIndex];
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
            data={this.state.data}
            setData={this.setData}
            getItems={this.getItems}
            changeMode={this.changeMode}
            reset={this.reset}
            itemIndex={this.state.itemIndex}
            goBack={this.goBack}
            renderer={this.renderer}
          />
        }
      </div>
    );
  }
}

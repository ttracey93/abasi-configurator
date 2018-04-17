import React from 'react';

import Strings from './constants/strings';
import Scale from './constants/scale';
import Headstyle from './constants/headstyle';
import Modes from './constants/modes';

import './Configurator.css';

import HomeView from './components/HomeView';
import OptionView from './components/OptionView';
import ConfirmationView from './components/ConfirmationView';
import PaymentView from './components/PaymentView';

import OPTIONS from './constants/options.json';

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

    this.state = {
      data: Configurator.getInitialData(),
      items: [OPTIONS],
      mode: Modes.HOME,
    };

    this.setData = this.setData.bind(this);
    this.getItems = this.getItems.bind(this);
    this.setItems = this.setItems.bind(this);
    this.goBack = this.goBack.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.reset = this.reset.bind(this);

    this.components = {
      [Modes.HOME]: HomeView,
      [Modes.OPTION]: OptionView,
      [Modes.CONFIRMATION]: ConfirmationView,
      [Modes.PAYMENT]: PaymentView,
    };

    console.log(this.components);
  }

  setData(data) {
    Object.assign(this.state.data, data);
    this.forceUpdate();
  }

  getItems() {
    return this.state.items[this.state.items.length - 1];
  }

  setItems(items) {
    this.state.items.push(items);
    this.forceUpdate();
  }

  // Reset guitar options
  reset() {
    this.setState({
      data: Configurator.getInitialData(),
    });
  }

  goBack() {
    this.state.items.pop();

    if (this.state.items.length === 1) {
      this.setState({
        mode: Modes.HOME,
      });
    } else {
      this.forceUpdate();
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

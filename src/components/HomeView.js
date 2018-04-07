import React from 'react';

import ViewPort from '../widgets/Viewport';
import Menu from '../widgets/Menu';

import TileTypes from '../constants/tile-types';

export default class HomeView extends React.Component {
  static getButtonData() {
    // TODO: Process from YAML file?
    return [{
      label: 'General',
      src: 'images/general.jpg',
      type: TileTypes.MENU,
    }, {
      label: 'Body',
      src: 'images/body.jpg',
      type: TileTypes.MENU,
    }, {
      label: 'Neck',
      src: 'images/neck.jpg',
      type: TileTypes.MENU,
    }, {
      label: 'Headstock',
      src: 'images/headstock.jpg',
      type: TileTypes.MENU,
    }, {
      label: 'Hardware',
      src: 'images/hardware.jpg',
      type: TileTypes.MENU,
    }, {
      label: 'Extras',
      src: 'images/extras.jpg',
      type: TileTypes.MENU,
    }];
  }

  constructor(props) {
    super(props);

    this.state = {
      menuItems: HomeView.getButtonData(),
    };
  }

  render() {
    return (
      <div className="container columns">
        <div className="container home-viewport">
          <ViewPort />
        </div>

        <div className="container home-menu">
          <Menu items={this.state.menuItems} />
        </div>
      </div>
    );
  }
}

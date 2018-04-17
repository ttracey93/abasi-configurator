import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Tile from './Tile';
// import TileTypes from '../constants/tile-types';
import Modes from '../constants/modes';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  handleChange(tile) {
    this.props.setData({
      [this.props.items.key]: tile,
    });

    this.props.goForward();
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  render() {
    const { products } = this.props.items;
    const tiles = _.map(products, (product, i) => <Tile key={i} data={product} callback={this.handleChange} />);

    return (
      <div className="menu">
        {tiles}
      </div>
    );
  }
}

Menu.propTypes = {
  items: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
};

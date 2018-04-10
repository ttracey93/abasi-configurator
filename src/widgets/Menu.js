import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Tile from './Tile';
import TileTypes from '../constants/tile-types';
import Modes from '../constants/modes';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  handleChange(tile) {
    console.log(tile);

    if (tile.type === TileTypes.MENU) {
      this.props.setItems(tile.options);
      this.changeMode(Modes.OPTION);
    } else if (tile.type === TileTypes.OPTION) {
      this.props.setData({
        [tile.key]: tile.value,
      });
    }
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  render() {
    const tiles = _.map(this.props.items, (item, i) => <Tile key={i} data={item} callback={this.handleChange} />);

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
  setItems: PropTypes.func.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Tile from './Tile';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.chooseColor = this.chooseColor.bind(this);

    this.colors = [{
      name: 'orange',
      color: 'orange',
    }, {
      name: 'red',
      color: 'red',
    }, {
      name: 'purple',
      color: 'purple',
    }, {
      name: 'white',
      color: 'white',
    }];
  }

  chooseColor(color) {
    this.props.renderer.colorChange(color);
  }

  handleChange(tile) {
    this.props.setData(tile, this.props.items.key);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  render() {
    const { items } = this.props;

    const tiles = _.map(items.products || items, (item, i) => {
      const imageSource = item.handle ? this.props.renderer.getTextureImage(item.handle) : undefined;
      return (
        <Tile key={i} data={item} callback={this.handleChange} imageSource={imageSource} />
      );
    });

    const className = this.props.columns ? 'menu columns' : 'menu';

    const colors = _.map(this.colors, (color) => {
      const style = {
        backgroundColor: color.color,
      };

      return (
        <div className="color" style={style} onClick={() => this.chooseColor(color.name)} />
      );
    });

    return (
      <div className={className}>
        <div className="logo-container">
          <img src="/logo-black.png" className="abasi-logo" />
        </div>

        <div className="tiles-container">
          {tiles}
        </div>

        <div className="color-container">
          {colors}
        </div>
      </div>
    );
  }
}

Menu.defaultProps = {
  columns: false,
};

Menu.propTypes = {
  items: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  columns: PropTypes.bool,
  renderer: PropTypes.object.isRequired,
};

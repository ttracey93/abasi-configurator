import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Tile from './Tile';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  handleChange(tile) {
    this.props.setData(tile, this.props.items.key);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  render() {
    const { items } = this.props;
    const tiles = _.map(items.products || items, (item, i) => <Tile key={i} data={item} callback={this.handleChange} />);

    const className = this.props.columns ? 'menu columns' : 'menu';

    return (
      <div className={className}>
        {tiles}
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
};

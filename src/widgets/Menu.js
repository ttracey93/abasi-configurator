import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Tile from './Tile';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const tiles = _.map(this.props.items, item => <Tile data={item} />);

    return (
      <div className="container">
        {tiles}
      </div>
    );
  }
}

Menu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Tile from './Tile';

const Menu = ({ items, callback, columns }) => {
  const tiles = _.map(items.products || items, (item, i) => {
    return (
      <Tile key={i} data={item} callback={callback} />
    );
  });

  const className = columns ? 'menu columns' : 'menu';

  return (
    <div className={className}>
      <div className="tiles-container">
        {tiles}
      </div>
    </div>
  );
}

Menu.defaultProps = {
  columns: false,
};

Menu.propTypes = {
  items: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
  columns: PropTypes.bool,
  renderer: PropTypes.object.isRequired,
};

export default Menu;

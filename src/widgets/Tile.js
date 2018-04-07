import React from 'react';
import PropTypes from 'prop-types';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tile">
        <div className="tile-label">
          {this.props.data.label}
        </div>
      </div>
    );
  }
}

Tile.propTypes = {
  data: PropTypes.object.isRequired,
};

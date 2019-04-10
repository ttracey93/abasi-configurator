import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Link to={this.props.url}>
        <div className="abasi-tile">
          <span className="abasi-tile-label">
            { this.props.title }
          </span>
        </div>
      </Link>
    );
  }
}

Tile.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Tile;

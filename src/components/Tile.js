import React from 'react';
import PropTypes from 'prop-types';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.callback(this.props.data);
  }

  render() {
    const label = this.props.data.label || this.props.data.title;

    return (
      <div className="flex tile" role="presentation" onClick={this.handleClick}>
        <span className="tile-label">
          {label}
        </span>

        {this.props.data.price &&
          <div className="tile-price">
            ${this.props.data.price} USD
          </div>
        }
      </div>
    );
  }
}

Tile.propTypes = {
  data: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
  imageSource: PropTypes.object,
};

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
      <div className="container columns evenly tile" role="presentation" onClick={this.handleClick}>
        <div className="tile-label">
          {label}
        </div>

        <div className="tile-icon">
          <i className="fa fa-bars" />
        </div>

        {this.props.data.variants &&
          <div className="tile-price">
            ${this.props.data.variants[0].price} USD
          </div>
        }
      </div>
    );
  }
}

Tile.propTypes = {
  data: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
};

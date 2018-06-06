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
    const { icon } = this.props.data;

    // Use fallback icon
    const iconSource = icon ? `icons/${icon}.svg` : 'icons/headstock.svg';

    return (
      <div className="container columns evenly tile" role="presentation" onClick={this.handleClick}>
        <div className="tile-label">
          {label}
        </div>

        <div className="tile-icon">
          {this.props.imageSource &&
            <img
              src={this.props.imageSource.src}
              alt="Texture Preview"
            />
          }

          {!this.props.imageSource &&
            <img
              className="icon-image"
              src={iconSource}
              alt="Configurator Icon"
            />
          }
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
  imageSource: PropTypes.object,
};

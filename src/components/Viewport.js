import React from 'react';
import PropTypes from 'prop-types';

import Price from './Price';
// import Modes from '../constants/modes';

export default class Viewport extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(data) {
    this.props.setData(data);
  }

  mountRenderer(element) {
    this.containerRef.appendChild(element);
  }

  render() {
    return (
      <div className="container evenly viewport">
        <div id="renderer-container" className="viewport-view" />

        <button type="button" className="viewport-review" onClick={this.props.handlePrice}>
          Review and Submit Order
        </button>

        <div className="viewport-price">  
          <Price price={this.props.price} handlePrice={this.props.handlePrice} />
        </div>
      </div>
    );
  }
}

Viewport.propTypes = {
  price: PropTypes.number.isRequired,
  handlePrice: PropTypes.func.isRequired,
};


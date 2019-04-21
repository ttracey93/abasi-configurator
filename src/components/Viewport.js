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
    const viewData = Object.assign({}, this.props.data);
    const showBackButton = this.props.itemIndex > 0;
    delete viewData.items;

    return (
      <div className="container evenly viewport">
        <div id="renderer-container" className="viewport-view" />

        {showBackButton &&
          <div className="back-button">
            <button className="btn" onClick={this.props.goBack}>
                Back
            </button>
          </div>
        }

        <div className="viewport-price">
          <Price price={this.props.price} />
          {/* <Price data={this.props.data} changeMode={this.changeMode} /> */}
        </div>
      </div>
    );
  }
}

Viewport.propTypes = {
  price: PropTypes.number.isRequired,
};


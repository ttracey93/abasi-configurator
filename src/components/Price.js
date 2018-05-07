import React from 'react';
import PropTypes from 'prop-types';

export default class Price extends React.Component {
  constructor(props) {
    super(props);

    this.handlePrice = this.handlePrice.bind(this);
  }

  handlePrice() {

  }

  render() {
    return (
      <div className="container evenly price-container">
        <div>
          <span className="price space-right">${this.props.data.price}</span>

          <i className="fa fa-question-circle price-icon tooltip" role="presentation" onClick={this.handlePrice}>
            <span className="tooltiptext">Click me for line item explanation of price</span>
          </i>
        </div>
      </div>
    );
  }
}

Price.propTypes = {
  data: PropTypes.object.isRequired,
};

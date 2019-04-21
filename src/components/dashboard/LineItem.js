import React from 'react';
import PropTypes from 'prop-types';

class LineItem extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { data } = this.props;

    if (data.maskFields) {
      return (
        <div className="flex abasi-lineitem">
          <div className="name">
            Name
          </div>
          
          <div className="price">
            Price
          </div>
        </div>
      );
    }

    return (
      <div className="flex abasi-lineitem">
        <div className="name">
          { data.name }
        </div>
        
        <div className="price">
          { data.price }
        </div>
      </div>
    );
  }
}

export default LineItem;

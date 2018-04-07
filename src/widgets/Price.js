import React from 'react';

export default class Price extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      price: 3625.96,
    };
  }

  render() {
    return (
      <div className="container evenly price-container">
        <div>
          <span className="space-right">${this.state.price}</span>
          <i className="fa fa-question-circle" />
        </div>
      </div>
    );
  }
}

import React from 'react';

import Price from './Price';

export default class Viewport extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container evenly">
        <div className="viewport-view">Viewport</div>

        <div className="reset-button">
          <button>
            Reset
          </button>
        </div>

        <div className="rotate-button">
          <button>
            Rotate
          </button>
        </div>

        <div className="viewport-price">
          <Price />
        </div>
      </div>
    );
  }
}

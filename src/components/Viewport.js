import React from 'react';
import PropTypes from 'prop-types';

// import Price from './Price';
// import Modes from '../constants/modes';

export default class Viewport extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.rotate = this.rotate.bind(this);
    this.switchModels = this.switchModels.bind(this);
    // this.purchase = this.purchase.bind(this);
  }

  handleChange(data) {
    this.props.setData(data);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  rotate() {
    console.log('rotated');
  }

  mountRenderer(element) {
    this.containerRef.appendChild(element);
  }

  switchModels() {
    console.log('Switching models!');
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

        {/* {this.props.reset && (
          <div className="reset-button">
            <button className="btn" onClick={this.props.reset}>
              Reset
            </button>
          </div>
        )} */}

        {/* <div className="rotate-button">
          <button className="btn" onClick={this.switchModels}>
            Switch Models
          </button>
        </div> */}

        {/* <div className="viewport-price">
          <Price data={this.props.data} changeMode={this.changeMode} />
        </div> */}
      </div>
    );
  }
}

Viewport.propTypes = {
  reset: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  itemIndex: PropTypes.number.isRequired,
};


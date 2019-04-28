import React from 'react';
import PropTypes from 'prop-types';

import ViewPort from '../Viewport';
import Menu from '../Menu';

export default class HomeView extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  handleChange(data, key) {
    this.props.setData(data, key);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  render() {
    return (
      <div className="container home">
        {!this.props.loading &&
          <div>
            {this.props.canGoBack &&
              <button disabled={!this.props.canGoBack} onClick={this.props.goBack} className="btn back-button">
                Go Back
              </button>
            }

            <div className="container home-menu">
              <Menu
                items={this.props.getItems()}
                columns
                renderer={this.props.renderer}
                callback={this.props.makeSelection}
              />
            </div>
          </div>
        }

        <div className="container home-viewport">
          <ViewPort
            price={this.props.price}
            handlePrice={this.props.handlePrice}
          />
        </div>
      </div>
    );
  }
}

HomeView.propTypes = {
  makeSelection: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  renderer: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  goBack: PropTypes.func.isRequired,
  handlePrice: PropTypes.func.isRequired,
};

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
        <div className="container home-menu">
          <Menu
            items={this.props.getItems()}
            columns
            renderer={this.props.renderer}
            callback={this.props.makeSelection}
          />
        </div>

        <div className="container home-viewport">
          <ViewPort
            price={this.props.price}
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
};

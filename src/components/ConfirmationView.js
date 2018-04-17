import React from 'react';
import PropTypes from 'prop-types';

// import ViewPort from '../widgets/Viewport';
import Menu from '../widgets/Menu';

export default class ConfirmationView extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.checkout = this.checkout.bind(this);
  }

  handleChange(data) {
    this.props.setData(data);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  async checkout() {

  }

  render() {
    return (
      <div className="container columns">
        <p>Dis da conf winder</p>

        <button onClick={this.checkout}>
          Checkout
        </button>
      </div>
    );
  }
}

ConfirmationView.propTypes = {
  reset: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  setItems: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

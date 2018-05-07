import React from 'react';
import PropTypes from 'prop-types';

import ViewPort from '../components/Viewport';
import Menu from '../components/Menu';

export default class HomeView extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  handleChange(data) {
    this.props.setData(data);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  render() {
    return (
      <div className="container columns">
        <div className="container home-viewport">
          <ViewPort
            data={this.props.data}
            setData={this.handleChange}
            changeMode={this.changeMode}
            reset={this.props.reset}
            itemIndex={this.props.itemIndex}
          />
        </div>

        <div className="container home-menu">
          <Menu
            items={this.props.getItems()}
            setData={this.handleChange}
            changeMode={this.changeMode}
          />
        </div>
      </div>
    );
  }
}

HomeView.propTypes = {
  reset: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  itemIndex: PropTypes.number.isRequired,
};
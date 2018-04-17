import React from 'react';
import PropTypes from 'prop-types';

import ViewPort from '../widgets/Viewport';
import Menu from '../widgets/Menu';

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
          />
        </div>

        <div className="container home-menu">
          <Menu
            items={this.props.getItems()}
            setData={this.handleChange}
            goForward={this.props.goForward}
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
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

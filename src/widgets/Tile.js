import React from 'react';
import PropTypes from 'prop-types';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.callback(this.props.data);
  }

  render() {
    return (
      <div className="container columns evenly tile" role="presentation" onClick={this.handleClick}>
        <div className="tile-label">
          {this.props.data.title}
        </div>

        <div className="tile-icon">
          <i className={`fa fa-2x ${this.props.data.icon}`} />
        </div>
      </div>
    );
  }
}

Tile.propTypes = {
  data: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
};

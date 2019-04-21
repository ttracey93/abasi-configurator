import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class LineItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.props.data,
      metadata: this.props.metadata,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    const data = this.state;

    if (data.maskFields) {
      return (
        <div className="flex abasi-lineitem">
          <div className="name">
            Name
          </div>
          
          <div className="price">
            Price
          </div>

          <div className="asset">
            Asset
          </div>

          <div className="delete">
            Delete
          </div>
        </div>
      );
    }

    return (
      <div className="flex abasi-lineitem">
        <div className="name">
          <input className=""
            type="text"
            name="name"
            placeholder="Name"
            value={data.name} 
            onChange={this.handleChange}
          />
        </div>
        
        <div className="price">
          <input className=""
            type="number"
            name="asset"
            value={data.price}
            onChange={this.handleChange}
          />
        </div>

        <div className="asset">
          <select name="asset" value={data.asset} className="" onChange={this.handleChange}>
            { _.map(data.metadata, m => <option value={m.id}>{m.filename}</option>)}
          </select>
        </div>

        <div className="delete">
          <button className="btn" type="button" onClick={() => { this.props.delete(data) }}>
            Delete
          </button>
        </div>
      </div>
    );
  }
}

LineItem.propTypes = {
  delete: PropTypes.func,
  metadata: PropTypes.array.isRequired,
};

export default LineItem;

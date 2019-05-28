import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FinishPicker from './FinishPicker';

class LineItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: null,
      metadata: this.props.metadata,
      ...this.props.data,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.getMaskedContent = this.getMaskedContent.bind(this);
    this.getMaskedFinishContent = this.getMaskedFinishContent.bind(this);
    this.getItemContent = this.getItemContent.bind(this);
    this.getFinishContent = this.getFinishContent.bind(this);
    this.getBodyWoodContent = this.getBodyWoodContent.bind(this);
    this.getMaskedBodyWoodContent = this.getMaskedBodyWoodContent.bind(this);
  }

  handleChange(event) {
    const { name } = event.target;
    let { value } = event.target;

    if (event.target.type === 'checkbox') {
      console.log('Checkbox!');

      value = event.target.checked;
    }
    
    const data = _.cloneDeep(this.state);
    delete data.metadata;
    data[name] = value;
    this.props.callback(data);

    this.setState({
      [name]: value,
    });
  }

  handleColor(color) {
    this.handleChange({
      target: {
        name: 'color',
        value: color.hex,
      }
    });
  }

  getMaskedContent() {
    const { itemKey } = this.props;
    console.log(itemKey);

    // TODO: Handle art series
    switch (itemKey) {
      case 'body-wood':
        return this.getMaskedBodyWoodContent();
      case 'finish':
        if (this.props.artSeries) {
          return this.getMaskedArtSeriesContent();
        }
        
        return this.getMaskedFinishContent();
      case 'sidedots':
      case 'hardware':
      case 'pickup-covers':
        return this.getMaskedMaterialContent();
      default:
        break;
    }

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

  getMaskedBodyWoodContent() {
    return (
      <div className="flex abasi-lineitem">
        <div className="name">
          Name
        </div>
        
        <div className="price">
          Price
        </div>

        <div className="asset">
          Transparent Texture
        </div>

        <div className="asset">
          Finish Texture
        </div>

        <div className="delete">
          Delete
        </div>
      </div>
    );
  }

  getMaskedMaterialContent() {
    return (
      <div className="flex abasi-lineitem">
        <div className="name">
          Name
        </div>

        <div className="price">
          Price
        </div>

        <div className="color">
          Color
        </div>

        <div className="delete">
          Delete
        </div>
      </div>
    );
  }

  getMaskedFinishContent() {
    return (
      <div className="flex abasi-lineitem">
        <div className="name">
          Name
        </div>

        <div className="price">
          Price
        </div>

        <div className="color">
          Color
        </div>

        <div className="transparent">
          Type
        </div>

        <div className="delete">
          Delete
        </div>
      </div>
    );
  }

  getMaskedArtSeriesContent() {
    return (
      <div className="flex abasi-lineitem">
        <div className="name">
          Name
        </div>

        <div className="price">
          Price
        </div>

        <div className="color">
          Color
        </div>

        <div className="transparent">
          Type
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

  getArtSeriesContent(data) {
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
            name="price"
            value={data.price}
            onChange={this.handleChange}
          />
        </div>
        
        <div className="color">
          <FinishPicker 
            color={ this.state.color || '#000' }
            onChangeComplete={ this.handleColor }
          />
        </div>

        <div className="transparent">
          <select
            name="type"
            value={data.type}
            onChange={this.handleChange}
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="artseries">Art Series</option>
          </select>
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

  getFinishContent(data) {
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
            name="price"
            value={data.price}
            onChange={this.handleChange}
          />
        </div>
        
        <div className="color">
          <FinishPicker 
            color={ this.state.color || '#000' }
            onChangeComplete={ this.handleColor }
          />
        </div>

        <div className="transparent">
          <select
            name="type"
            value={data.type}
            onChange={this.handleChange}
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="artseries">Art Series</option>
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

  getBodyWoodContent(data) {
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
            name="price"
            value={data.price}
            onChange={this.handleChange}
          />
        </div>

        <div className="asset">
          <select name="transparentAsset" value={data.transparentAsset} className="" onChange={this.handleChange}>
            { _.map(data.metadata, m => <option value={m.id}>{m.filename}</option>)}
          </select>
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

  getMaterialContent(data) {
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
            name="price"
            value={data.price}
            onChange={this.handleChange}
          />
        </div>
        
        <div className="color">
          <FinishPicker 
            color={ this.state.color || '#000' }
            onChangeComplete={ this.handleColor }
          />
        </div>

        <div className="delete">
          <button className="btn" type="button" onClick={() => { this.props.delete(data) }}>
            Delete
          </button>
        </div>
      </div>
    );
  }

  getDefaultContent(data) {
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
            name="price"
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

  getItemContent(data) {
    const { itemKey } = this.props;

    console.log(this.props);

    switch (itemKey) {
      case 'body-wood':
        return this.getBodyWoodContent(data);
      case 'finish':
        if (this.props.artSeries) {
          return this.getArtSeriesContent(data);
        } 

        return this.getFinishContent(data);
      case 'sidedots':
      case 'hardware':
      case 'pickup-covers':
        return this.getMaterialContent(data);
      default:
        return this.getDefaultContent(data);
    }
  }

  render() {
    const data = this.state;

    if (data.maskFields) {
      return this.getMaskedContent();
    }

    return this.getItemContent(data);
  }
}

LineItem.propTypes = {
  delete: PropTypes.func,
  callback: PropTypes.func,
  metadata: PropTypes.array.isRequired,
};

export default LineItem;

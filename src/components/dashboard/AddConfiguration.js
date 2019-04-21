import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import _ from 'lodash';

import ConfigurationService from '../../services/ConfigurationService';
import LineItem from './LineItem';

class AddConfiguration extends React.Component {
  constructor(props) {
    super(props);

    const id = this.props.match ? this.props.match.params.id : undefined;

    this.state = {
      editing: id || false,
      loading: id || false,
      config: {
        id: undefined,
        title: undefined,
        description: undefined,
        type: 'texture',
        position: 99,
        key: undefined,
        options: [],
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.getConfiguration = this.getConfiguration.bind(this);
    this.addLineItem = this.addLineItem.bind(this);
  }

  componentDidMount() {
    if (this.props.match && this.props.match.params.id) {
      this.getConfiguration(this.props.match.params.id);
    }
  }

  async getConfiguration(id) {
    console.log('getting configuration...', id);

    const config = await ConfigurationService.get(id);

    console.log(config);

    this.setState({
      config,
      loading: false,
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { config } = this.state;
    config[name] = value;

    this.setState({
      config,
    });
  }

  async save(event) {
    event.preventDefault();

    console.log(this.state);

    const { title, description, key } = this.state.config;

    if (!title || !description || !key) {
      return toast.error('Must provide title, description, and key');
    }

    await ConfigurationService.create(this.state.config);
    toast.success('Successfully saved configuration item!');

    this.props.history.push('/config');
  }

  addLineItem() {
    const { config } = this.state;
    ConfigurationService.createLineitem(config, {});
    
    this.setState({
      config,
    });
  }

  getLineItems(items) {
    // Magic for first configuration item
    items = [{
      maskFields: true,
    }, ...items];

    return _.map(items, item => <LineItem data={item} key={`lineitem-${item.name}`} />);
  }
  
  render() {
    const { loading, editing, config } = this.state;

    if (loading) {
      return (
        <div className="abasi-add flex columns">
          <ClipLoader />
          Loading Configuration...
        </div>
      )
    }

    const lineitems = this.getLineItems(config.options);

    return (
      <div className="abasi-add flex columns">
        { editing &&
          <h1>Edit Configuration Item</h1>
        }

        {!editing &&
          <h1>Add Configuration Item</h1>
        }

        <form onSubmit={this.save} className="flex">
          <div className="flex columns">
            <label htmlFor="title">
              <span className="label">Title:</span>

              <input className="abasi-input"
                type="text"
                name="title"
                placeholder="Title"
                value={config.title} 
                onChange={this.handleChange}
              />
            </label>

            <label htmlFor="description">
              <span className="label">Description:</span>

              <input className="abasi-input"
                type="text"
                name="description"
                placeholder="Description"
                value={config.description} 
                onChange={this.handleChange}
              />
            </label>

            <label htmlFor="key">
              <span className="label">Key:</span>

              <input className="abasi-input"
                type="text"
                name="key"
                placeholder="Key"
                value={config.key} 
                onChange={this.handleChange}
              />
            </label>

            <label htmlFor="type">
              <span className="label">Configuration Type:</span>

              <select name="type" value={config.type} className="abasi-input" onChange={this.handleChange}>
                <option value="texture">Texture</option>
                <option value="model">Model</option>
                <option value="material">Material</option>
                <option value="submenu">Submenu</option>
              </select>
            </label>

            <label htmlFor="position">
              <span className="label">Position:</span>

              <input className="abasi-input"
                type="number"
                name="position"
                value={config.position}
                onChange={this.handleChange}
              />
            </label>

            <button type="submit" className="btn abasi-add-button">
              Save Configuration Item
            </button>
          </div>
        </form>

        <div className="flex columns abasi-selections">
          <h1>Configuration Line Items</h1>

          <button className="btn abasi-add-line-item" onClick={this.addLineItem}>
            Add New Line Item
          </button>

          <div className="flex columns lineitems">
            { lineitems }
          </div>
        </div>
      </div>
    );
  }
}

AddConfiguration.propTypes = {
  match: PropTypes.object,
};

export default AddConfiguration;
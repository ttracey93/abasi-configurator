import React from 'react';
import ConfigurationService from '../../services/ConfigurationService';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

class ManageConfiguration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      config: null,
    };

    this.getConfiguration();

    this.handleChange = this.handleChange.bind(this);
  }

  async getConfiguration() {
    let config = await ConfigurationService.getAll();
    config = _.sortBy(config, 'position');

    this.setState({
      config,
    })
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  getLineitem(config) {
    return (
      <div className="abasi-config-item" key={config.id}>
        <div className="position">{ config.position }.</div>
        <div className="title">{ config.title }</div>
        <div className="description">{ config.description }</div>
        <div className="type">{ config.type}</div>
        <div className="options">{ config.options.length } Subitems</div>
        <div className="shuffle">
          <button className="move up">
            <i className="fa fa-arrow-up"></i>
          </button>

          <button className="move down">
            <i className="fa fa-arrow-down"></i>
          </button>
        </div>
      </div>
    );
  }
  
  getConfigContent(config) {
    console.log(config);
    const lineitems = _.map(config, this.getLineitem);

    return (
      <div className="flex columns abasi-config-items">
        <div className="abasi-config-item">
          <div className="position">#</div>
          <div className="title">Title</div>
          <div className="description">Description</div>
          <div className="type">Type</div>
          <div className="options"># of Subitems</div>
          <div className="shuffle">Reorder config item</div>
        </div>

        { lineitems }
      </div>
    );
  }

  render() {
    const { config, saving } = this.state;
    let content;

    if (config && config.length) {
      content = this.getConfigContent(config);
    } else {
      content = (
        <span className="flex columns loading">
          <ClipLoader />
          <p>Loading Configuration</p>
        </span>
      );
    }

    return (
      <div className="flex columns abasi-config">
        <h1>Configuration Management</h1>

        <Link to="/add-config">
          <button className="add-config">
            Add Configuration Item
          </button>
        </Link>

        <div className="flex columns abasi-config-wrapper">
          { content }
        </div>

        <button>
          { saving && 
            <ClipLoader />
          }

          { !saving && 
            <span>Save Configuration</span>
          }
        </button>
      </div>
    );
  }
}

export default ManageConfiguration;

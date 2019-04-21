import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AssetService from '../../services/AssetService';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { Storage } from '../../firebase';
import FileUploader from "react-firebase-file-uploader";

class ManageAssets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      uploading: false,
      assets: null,
      models: null,
    };

    this.getMetadata = this.getMetadata.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getMetadata();
  }

  async getMetadata() {
    // TODO: Load in asset metadata from the GS bucket

    this.setState({
      loading: false,
    })
  }

  async deleteAsset() {
    // Delete Assets
  }

  handleUploadStart = () => this.setState({ uploading: true, progress: 0 });

  handleProgress = progress => this.setState({ progress });

  handleUploadError = error => {
    this.setState({ uploading: false });
    toast.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, uploading: false });
    toast.success('File uploaded successfully');
  };

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  getAssetContent(asset) {
    return (
      <tr className="abasi-assets-row" key={asset.id}>
        <td>{ asset.name }</td>
        <td>{ asset.id }</td>
        <td>{ asset.size }</td>

        <td>
          <button className="abasi-assets-table-button" onClick={() => { this.deleteAsset(asset.id) }}>
            Delete Asset
          </button>
        </td>
      </tr>
    );
  }

  getManageContent() {
    const { loading } = this.state;

    if (loading) {
      return (
        <div className="abasi-manage-assets loading flex columns">
          <ClipLoader />
          <p>Loading asset metadata...</p>
        </div>
      );
    }

    const assetContent = _.map(this.state.assets, this.getAssetContent);

    return (
      <div className="abasi-manage-assets flex columns">
        <h1>Manage Assets</h1>
  
        <table className="abasi-assets-table abasi-table" border="1" frame="void" rules="rows">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Asset ID</th>
              <th>File Size</th>
              <th>Delete Asset</th>
            </tr>
          </thead>
  
          <tbody>
            { assetContent }
          </tbody>
        </table>
      </div>
    );
  }

  getModelContent() {
    return (
      <div className="abasi-upload-model flex columns">
        <h1>Upload Model</h1>
        
        <label htmlFor="model">
          <span className="label">
            Choose File: 
          </span>

          <FileUploader
            accept=".fbx,.obj"
            name="model"
            storageRef={Storage.ref('models')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          />
        </label>
      </div>
    );
  }

  getTextureContent() {
    return (
      <div className="abasi-upload-texture flex columns">
        <h1>Upload Texture</h1>
        
        <label htmlFor="texture">
          <span className="label">
            Choose File: 
          </span>

          <FileUploader
            accept="image/*"
            name="texture"
            storageRef={Storage.ref('textures')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          />
        </label>
      </div>
    );
  }

  render() {
    return (
      <div className="flex columns abasi-assets">
        <h1>Asset Management</h1>

        <Tabs>
          <TabList>
            <Tab>Manage Assets</Tab>
            <Tab>Upload Model</Tab>
            <Tab>Upload Texture</Tab>
          </TabList>

          <TabPanel>
            { this.getManageContent() }
          </TabPanel>

          <TabPanel>
            { this.getModelContent() }
          </TabPanel>

          <TabPanel>
            { this.getTextureContent() }
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default ManageAssets;

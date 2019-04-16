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

    // TODO: Create test data and use assets service
    this.state = {
      uploading: false,
      assets: null,
      modelName: '',
      textureName: '',
      model: undefined,
      texture: undefined,
    };

    this.getAssets();

    this.handleChange = this.handleChange.bind(this);
    this.uploadModel = this.uploadModel.bind(this);
    this.uploadTexture = this.uploadTexture.bind(this);
  }

  async getAssets() {
    const assets = await AssetService.getAll();

    this.setState({
      assets,
    });
  }

  async deleteAsset() {
    // TODO: Delete asset record from database
  }

  async uploadModel(event) {
    event.preventDefault();
    const { modelName, model } = this.state;

    if ((!modelName || modelName === '') || !model) {
      return toast.error('Must name model and choose model file');
    }

    this.setState({
      uploading: true,
    });

    console.log('Uploading model!');
  }

  async uploadTexture(event) {
    event.preventDefault();
    const { textureName, texture, textureData } = this.state;


    console.log(texture);
    console.log(textureData);
    if ((!textureName || textureName === '') || !texture) {
      return toast.error('Must name texture and choose texture file');
    }

    this.setState({
      uploading: true,
    });

    console.log('Uploading texture!');

    // Upload texture
    const response = await AssetService.upload(textureName, texture);
    console.log(response);

    toast.success('Texture successfully uploaded');
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
    const { name, files } = event.target;
    let { value } = event.target;

    console.log(files);

    if (files) {
      const formData = new FormData();
      console.log(files);
      const files = Array.from(event.target.files)
      files.forEach((file, i) => {
        formData.append(i, file)
      });

    } else {
      this.setState({
        [name]: value,
      });
    }
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
        
        <form onSubmit={this.uploadModel}>
          <label htmlFor="modelName">
            <span className="label">
              Model Name: 
            </span>

            <input className="abasi-input"
              type="text"
              name="modelName"
              placeholder="Model Name"
              value={this.state.modelName} 
              onChange={this.handleChange}
            />
          </label>

          <label htmlFor="model">
            <span className="label">
              Choose File: 
            </span>

            <FileUploader
              accept=".fbx,.obj"
              name="model"
              storageRef={Storage.ref("assets")}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
            />
          </label>

          <button type="submit" className="btn abasi-login-button">
            { this.state.uploading && 
              <i className="fa fa-spin fa-refresh" />
            }

            { !this.state.uploading &&
              <span>Upload Model</span>
            }
          </button>
        </form>
      </div>
    );
  }

  getTextureContent() {
    return (
      <div className="abasi-upload-texture flex columns">
        <h1>Upload Texture</h1>
        
        <form onSubmit={this.uploadTexture}>
          <label htmlFor="textureName">
            <span className="label">
              Texture Name: 
            </span>

            <input className="abasi-input"
              type="text"
              name="textureName"
              placeholder="Texture Name"
              value={this.state.textureName} 
              onChange={this.handleChange}
            />
          </label>

          <label htmlFor="texture">
            <span className="label">
              Choose File: 
            </span>

            {/* <input className="abasi-input"
              type="file"
              accept=".jpg,.png"
              name="texture"
              value={this.state.texture} 
              onChange={this.handleChange}
            /> */}

            <FileUploader
              accept="image/*"
              name="texture"
              storageRef={Storage.ref("assets")}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
            />
          </label>

          <button type="submit" className="btn abasi-login-button">
            { this.state.uploading && 
              <i className="fa fa-spin fa-refresh"></i>
            }

            { !this.state.uploading &&
              <span>Upload Texture</span>
            }
          </button>
        </form>
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

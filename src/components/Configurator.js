import React from 'react';
import _ from 'lodash';

// Constants
import Modes from '../constants/modes';
import SelectionTypes from '../constants/selection-types';

// WebGL Renderer
import Renderer from './Renderer';

// Views
import HomeView from './views/HomeView';
import OptionView from './views/OptionView';
import PaymentView from './views/PaymentView';
import ConfirmationView from './views/ConfirmationView';
import ConfigurationService from '../services/ConfigurationService';
import { ClipLoader } from 'react-spinners';
import AssetService from '../services/AssetService';
import { toast } from 'react-toastify';

const Three = require('three');

export default class Configurator extends React.Component {
  constructor(props) {
    super(props);

    // Initial State
    this.state = {
      loading: false,
      items: [[]],
      mode: Modes.HOME,
      price: 0,
      selections: Configurator.getInitialData(),
    };

    // Event bindings
    this.getItems = this.getItems.bind(this);
    this.makeSelection = this.makeSelection.bind(this);
    this.propogateEvent = this.propogateEvent.bind(this);
    this.evaluatePrice = this.evaluatePrice.bind(this);
    this.enableBackButton = this.enableBackButton.bind(this);
    this.goBack = this.goBack.bind(this);
    this.configureSelection = this.configureSelection.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleMain = this.handleMain.bind(this);
    this.submitOrder = this.submitOrder.bind(this);

    // Setup components to use for different views
    this.components = {
      [Modes.HOME]: HomeView,
      [Modes.OPTION]: OptionView,
      [Modes.PAYMENT]: PaymentView,
      [Modes.CONFIRMATION]: ConfirmationView,
    };

    this.renderer = new Renderer(this.state.data);
  }

  async componentDidMount() {
    // Startup/attach renderer
    this.rendererContainer = document.getElementById('renderer-container');
    this.renderer.container = this.rendererContainer;

    // Initialize the scene if we haven't already done so
    if (!this.renderer.scene) {
      this.renderer.createScene();
    }

    this.rendererContainer.appendChild(this.renderer.getRendererElement());

    // Begin pricing module
    this.evaluatePrice();

    // Grab configuration items for the user menu
    const items = await ConfigurationService.getConfig();
    const models = await AssetService.getModelMetadata();
    const textures = await AssetService.getTextureMetadata();

    const sortedItems = _.sortBy(items, (i) => {
      return Number.parseInt(i.position);
    });

    this.setState({
      items: [sortedItems],
      models,
      textures,
    });
  }

  componentDidUpdate() {
    // Update/re-attach renderer
    if (this.state.mode !== Modes.CONFIRMATION) {
      this.rendererContainer = document.getElementById('renderer-container');
      this.renderer.container = this.rendererContainer;
      this.rendererContainer.appendChild(this.renderer.getRendererElement());
      this.renderer.resize();
      this.renderer.assets = {
        models: this.state.models,
        textures: this.state.textures,
      };
    }
  }

  static getInitialData() {
    return {
      body: {asset: "c95aa5d830344811b8e726740199dda0", id: "6d65d532ad564be39484f29eb8526521", name: "Eight String", price: "2399"},
      ['body-wood']: {asset: "5b06ca27a3fa40648e4261ba722521c5", color: "#000", id: "923e7yrq98w7dyf", location: "textures/roasted-eastern-hard-rock-flamed-maple.png", name: "Alder", price: "0"},
      neck: {asset: "812bdd08e0a0433a9eec59a835736bee", color: "#000", id: "b15f39a18970471e9b632e2b0085db13", name: "Genuine Mahogany", price: "0"},
      fingerboard: {asset: "4405833b559f462381727a1b538182ed", color: "#000", id: "fe58aedfd9104bfd878f11c785e08a61", name: "Richlite", price: "0"},
      sidedots: {color: "#000", id: "4261991f913648ab9cdee1a50e55a0a3", name: "White", price: "0"},
      hardware: {color: "#000", id: "c53266c4916242128c2f6889f28cf5b6", name: "Chrome", price: "0"},
      battery: {color: "#000", id: "6370194e256a4ae28264bcd0063abf6a", name: "Default 9V Battery", price: "0"},
      pickups: {color: "#000", id: "aef2b3e099d64a23a813d01be244c855", name: "White", price: "0"},
      finish: {color: "#fcfcfc", id: "af47f49cfc0e4a6e9f7954d3e1d54948", name: "Natural Transparent", price: "0"},
    };
  }

  async makeSelection(selection) {
    switch (selection.type) {
      case SelectionTypes.MENU:
      case SelectionTypes.MODEL:
      case SelectionTypes.MATERIAL:
      case SelectionTypes.TEXTURE:
      case SelectionTypes.FINISH:
        this.performUpdate(selection);
        break;
      default:
        this.configureSelection(selection);
        break;
    }
  }

  async performUpdate(selection) {
    const { items } = this.state;
    items.push(selection.options);

    this.setState({
      items,
      key: selection.key,
      type: selection.type,
    });

    this.evaluatePrice();
  }

  async configureSelection(selection) {
    console.log(selection);

    const { selections, key, type } = this.state;

    this.setState({
      loading: true,
    });

    try {
      switch(type) {
        case 'model':
          console.log('model at:', key);
          await this.renderer.selectModel(selection, key);
          break;
        case 'material':
          console.log('material at:', key);
          await this.renderer.selectMaterial(selection, key);
          break;
        case 'texture':
          console.log('texture at:', key);
          await this.renderer.selectTexture(selection, key);
          break;
        case 'finish':
          console.log('finish at:', key);
          await this.renderer.selectFinish(selection, key);
          break;
        default:
          console.log('This is something else entirely');
          break;
      }
    } catch (ex) {
      console.log(ex);
      toast.error('Hmm...having trouble loading that asset');
    }

    selections[key] = selection;
    this.setState({
      selections,
      loading: false,
    });

    this.evaluatePrice();
  }


  async evaluatePrice() {
    const price = Number.parseInt(_.map(this.state.selections, s => s.price).reduce((p, c) => {
      p = Number.parseInt(p);
      c = Number.parseInt(c);

      return p + c;
    }));

    this.setState({
      price,
    })
  }

  getItems() {
    return this.state.items[this.state.items.length - 1];
  }

  enableBackButton() {
    return this.state.items.length > 1;
  }

  goBack() {
    const { items } = this.state;

    if (items.length > 1) {
      items.pop();

      this.setState({
        items,
      });
    } else {
      console.log('Should not be trying to go back...');
    }
  }

  // Reset guitar options
  reset() {
    // this.setState({
    //   data: Configurator.getInitialData(),
    // });
  }
  
  // Modal utilities
  changeMode(mode) {
    this.setState({
      mode,
    });
  }

  handlePrice() {
    this.changeMode(Modes.CONFIRMATION);
  }

  handleMain() {
    this.changeMode(Modes.HOME);
  }

  propogateEvent(event) {
    // TODO: Event handler code for renderer events
    this.renderer.handleEvent(event, this.state.data);
  }

  async submitOrder() {
    console.log('Submitting order...');
    toast.success('Successfully submitted order!');
  }

  render() {
    // TODO: Pre-rendered components?
    const Component = this.components[this.state.mode];

    if (!Component) {
      throw new Error(`Component missing for mode ${this.state.mode}`);
    }

    return (
      <div className="configurator">
        { this.state.loading &&
          <div className="configurator-spinner">
            <ClipLoader />
            <p>Loading...</p>
          </div>
        }

        {this.getItems() &&
          <Component
            renderer={this.renderer}
            getItems={this.getItems}
            makeSelection={this.makeSelection}
            price={this.state.price}
            loading={this.state.loading}
            canGoBack={this.enableBackButton()}
            goBack={this.goBack}
            handlePrice={this.handlePrice}
            handleMain={this.handleMain}
            data={this.state.selections}
            submitOrder={this.submitOrder}
          />
        }
      </div>
    );
  }

  /* Renderer coupling */
  async getModel() {
    // Axios.get('https://firebasestorage.googleapis.com/v0/b/abasi-configurator/o/models%2F3.FBX?alt=media&token=72d4c4c7-5bcc-47d9-90e5-dfe13b115750', {
    //   responseType: 'arraybuffer',
    // }).then((response) => {
    //   // TODO: Make async
    //   const fbxScene = loader.parse(response.data, '/');
    //   this.renderer.prepareModel(fbxScene);

    //   this.setState({
    //     loading: false,
    //   });
    // });

    

  }

  // loadModel(path, cb) {
  //   console.log('Loading model...', path);
  //   new FBXLoader().load(path, cb);
  // }

  // loadModelOBJ(path, cb) {
  //   console.log('Loading OBJ model...', path);
  //   new Three.OBJLoader().load(path, cb);
  // }

  // loadTexture(path) {
  //   console.log('Loading texture...', path);

  //   const texture = this.textureLoader.load(path);
  //   texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
  //   texture.wrapS = Three.ClampToEdgeWrapping;
  //   texture.wrapT = Three.ClampToEdgeWrapping;
  //   texture.minFilter = Three.LinearMipMapLinearFilter;
  //   texture.magFilter = Three.LinearMipMapLinearFilter;

  //   return texture;
  // }
}

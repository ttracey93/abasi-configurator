import ColladaLoader from 'three-collada-loader';
import FBXLoader from 'three-fbxloader-offical';
import OBJLoader from 'three-obj-loader';
import OrbitControls from 'three-orbitcontrols';
import Events from '../constants/events';
import Materials from './helpers/Materials';
import { DB } from '../firebase';
import Axios from 'axios';

import lz from 'lz-string';

const Three = require('three');

OBJLoader(Three);

export default class Renderer {
  constructor(data) {
    Three.Cache.enabled = true;

    this.TEXTURE_ANISOTROPY = 16;

    this.data = data;

    // Event bindings
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
    this.prepareModel = this.prepareModel.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.colorChange = this.colorChange.bind(this);
    this.createScene = this.createScene.bind(this);

    // Need to set container on instance
    this.renderer = new Three.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor(0xffffff, 0);

    this.container = undefined;
    this.textureLoader = new Three.TextureLoader();

    // Local Colors
    this.colors = {
      orange: new Three.MeshPhysicalMaterial( { color: 0xf48942, metalness: 0.9, roughness: 0.2, name: 'orange' } ),
      red: new Three.MeshPhysicalMaterial( { color: 0xe50b2f, metalness: 0.9, roughness: 0.2, name: 'red' } ),
      purple: new Three.MeshPhysicalMaterial( { color: 0x8409b5, metalness: 0.9, roughness: 0.2, name: 'purple' } ),
      white: new Three.MeshPhysicalMaterial( { color: 0xffffff, metalness: 0.9, roughness: 0.2, name: 'purple' } ),
    };

    this.models = {};
    this.materials = {};

    const reflectionCube = Materials.envMap();

    this.metalMaterial = Materials.metalWithColor(reflectionCube, 0xd6d1cd);
    this.darkMetalMaterial = Materials.metalWithColor(reflectionCube, 0x222222);
    this.blackMetalMaterial = Materials.metalWithColor(reflectionCube, 0x000000);

    this.brownMaterial = Materials.withColor(reflectionCube, 0xa57136);
    this.whiteMaterial = Materials.withColor(reflectionCube, 0xffffff);
  }

  getRendererElement() {
    return this.renderer.domElement;
  }

  update(data) {
    // TODO: Update model based on selections?
  }

  async createScene() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.scene = new Three.Scene();
    this.camera = new Three.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 200);

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1;
    this.controls.maxDistance = 150;
    this.controls.minDistance = 50;
    this.controls.panSpeed = 0;
    this.controls.noZoom = false;
    this.controls.noPan = true;
    
    const ambient = new Three.AmbientLight( 0xffffff, 1 );
    this.scene.add( ambient );

    // TODO: Set light position
    const spotLight = new Three.DirectionalLight( 0xffffff, 0.4 );
    this.scene.add( spotLight );
    this.spotLight = spotLight;

    this.getModel();

    window.addEventListener('resize', this.resize, false);

    // Begin animation loop
    this.animate();
  }

  async getModel() {
    const loader = new FBXLoader();

    Axios.get('http://localhost:9000/1.fbx', {
      responseType: 'arraybuffer',
    }).then((response) => {
      const fbxScene = loader.parse(response.data, '/');

      Axios.post('http://localhost:9000/save', fbxScene);

      this.models.abasi = fbxScene;
      this.prepareModel();
    });

  }

  loadModel(path, cb) {
    console.log('Loading model...', path);
    new FBXLoader().load(path, cb);
  }

  loadModelOBJ(path, cb) {
    console.log('Loading OBJ model...', path);
    new Three.OBJLoader().load(path, cb);
  }

  loadTexture(path) {
    console.log('Loading texture...', path);

    const texture = this.textureLoader.load(path);
    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    texture.wrapS = Three.ClampToEdgeWrapping;
    texture.wrapT = Three.ClampToEdgeWrapping;
    texture.minFilter = Three.LinearMipMapLinearFilter;
    texture.magFilter = Three.LinearMipMapLinearFilter;

    return texture;
  }

  resize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  /* eslint-disable no-param-reassign */
  setModel(model) {
    this.scene.remove(this.currentModel);

    model.traverse((node) => {
      if (node.isMesh) {
        node.material.map = this.currentTexture;
      }
    });

    this.currentModel = model;
    this.scene.add(model);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderScene();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.animate();
  }

  handleEvent(event, data) {
    switch (event) {
      case Events.COLOR:
        this.colorChange(data.finish);
        break;
      default:
        console.log('Invalid event type', event);
        break;
    }
  }

  colorChange(color) {
    console.log('Color change!!!', color);

    const colorMat = this.colors[color];

    if (!colorMat) {
      return console.log('Invalid color material specified!', color);
    }

    const fbx = this.models.abasi;
    colorMat.emissive = colorMat.color;

    fbx.traverse( child  => {
      if (child.isMesh) {
        switch(child.name) {
          case 'Body':
            child.material = colorMat;
            break;
        }
      }
    });
  }

  prepareModel() {
    const model = this.models.abasi;


    model.traverse( child => {
      if ( child instanceof Three.Mesh ) {
        child.geometry.computeVertexNormals(true);

        switch (child.name) {
          case 'Pickups':
            child.material = this.whiteMaterial;
            break;
          case 'Bridge':
            child.material = this.blackMetalMaterial;
            break;
          case 'Fret_dots_Big_side':
          case 'Fret_dots_Big_side':
          case 'Abasi_Logo':
            child.material = this.whiteMaterial;
            break;
          case 'Strings':
            // child.material.visible = false;
            // break;
          case 'String_ends':
          case 'Tuners':
            child.material = this.metalMaterial;
            break;
          case 'Strap_holder':
          case 'String_holder':
            child.material = this.metalMaterial;
            break;
          case 'Body':
          case 'Neck_Head':
            child.material = this.darkMetalMaterial;
            break;
          case 'FRET_Board':
            child.material = this.brownMaterial;
            break;
          default:
            child.material = this.metalMaterial;
            break;
        }
      }

      console.log(child);
    });

    model.rotation.y = Math.PI;
    this.scene.add(model);
  }
}

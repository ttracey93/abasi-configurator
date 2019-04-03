import ColladaLoader from 'three-collada-loader';
import FBXLoader from 'three-fbxloader-offical';
import OBJLoader from 'three-obj-loader';
import OrbitControls from 'three-orbitcontrols';
import Events from '../constants/events';

const Three = require('three');

OBJLoader(Three);

export default class Renderer {
  constructor(data) {
    this.TEXTURE_ANISOTROPY = 16;

    this.data = data;

    // Event bindings
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);

    // Need to set container on instance
    this.renderer = new Three.WebGLRenderer();
    this.container = undefined;
    this.textureLoader = new Three.TextureLoader();

    this.textures = {
      diffuse: this.loadTexture('new/guitar/original/textures/Default_Diffuse.png'),
      normal: this.loadTexture('new/guitar/original/textures/Default_Normal.png'),
      roughness: this.loadTexture('new/guitar/original/textures/Default_Roughness.png'),
      specular: this.loadTexture('new/guitar/original/textures/Default_Specular.png'),
    };

    this.diffuseMaterial = new Three.MeshPhongMaterial({ map: this.textures.diffuse });

    // Event handlers
    this.handleEvent = this.handleEvent.bind(this);
    this.colorChange = this.colorChange.bind(this);

    // TODO: Create local model repository by key

    // Local Colors
    this.colors = {
      orange: new Three.MeshPhysicalMaterial( { color: 0xf48942, metalness: 0.9, roughness: 0.2, name: 'orange' } ),
      red: new Three.MeshPhysicalMaterial( { color: 0xe50b2f, metalness: 0.9, roughness: 0.2, name: 'red' } ),
      purple: new Three.MeshPhysicalMaterial( { color: 0x8409b5, metalness: 0.9, roughness: 0.2, name: 'purple' } ),
      white: new Three.MeshPhysicalMaterial( { color: 0xffffff, metalness: 0.9, roughness: 0.2, name: 'purple' } ),
    };

    this.models = {};
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
    this.camera = new Three.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 30, -50);

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1;
    this.controls.maxDistance = 150;
    this.controls.minDistance = 35;
    this.controls.panSpeed = 0;
    this.controls.noZoom = false;
    this.controls.noPan = true;

    // Background and lighting
    this.scene.background = new Three.Color( 0xffffff );
    
    const ambient = new Three.AmbientLight( 0xffffff, 0.6 );
    this.scene.add( ambient );

    const spotLight = new Three.DirectionalLight( 0xffffff, 0.4 );
    spotLight.position.set( 35, 15, -20 );
    this.scene.add( spotLight );
    this.spotLight = spotLight;
    this.spotLight.lookAt(30, 15, 0);

    this.loadModel('abasi/raw.fbx', fbx => {
      fbx.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      fbx.position.x = 30;
      fbx.position.y = 15;
      fbx.rotation.x = - Math.PI / 2;

      console.log(fbx.position);

      this.scene.add(fbx);
      this.models.abasi = fbx;
    });
  
    window.addEventListener('resize', this.resize, false);

    // Begin animation loop
    this.animate();
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

    fbx.traverse( function ( child ) {
      if (child.material) {
        child.material = colorMat;
      }
    });

    // this.scene.background = new Three.Color(colorMat.color);
  }
}

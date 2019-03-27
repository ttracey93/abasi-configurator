import ColladaLoader from 'three-collada-loader';
import OBJLoader from 'three-obj-loader';
import OrbitControls from 'three-orbitcontrols';

const Three = require('three');

OBJLoader(Three);

export default class Renderer {
  constructor(data) {
    this.TEXTURE_ANISOTROPY = 16;

    // this.data = data;

    // Event bindings
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);

    // Need to set container on instance
    this.renderer = new Three.WebGLRenderer();
    this.container = undefined;
    this.loader = new ColladaLoader(this.loadingManager);
    this.textureLoader = new Three.TextureLoader();
  }

  getRendererElement() {
    return this.renderer.domElement;
  }

  async createScene() {
    console.log(this.container);
    
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.scene = new Three.Scene();
    this.scene.background = new Three.Color(0x464646);

    this.camera = new Three.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, -80, 0);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.ambientLight = new Three.AmbientLight(0xcccccc, 0.5);
    this.scene.add(this.ambientLight);

    this.directionalLight = new Three.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(1, 1, 0).normalize();
    this.scene.add(this.directionalLight);

    this.loadModel('new/guitar/original/source/G_LP_READY.obj', obj => {
      console.log('loaded scene?');

      console.log(obj);

      this.scene.add(obj);
    });

    window.addEventListener('resize', this.resize, false);
  }

  loadModel(path, cb) {
    console.log('Loading model...', path);
    console.log(typeof Three.OBJLoader);
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
    this.directionalLight.position.copy(this.camera.position);

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
}

import * as Three from 'three';
import ColladaLoader from 'three-collada-loader';
import OrbitControls from 'three-orbitcontrols';

export default class Renderer {
  constructor(data) {
    this.data = data;

    // Event bindings
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);

    // Need to set container on instance
    this.container = undefined;
    this.loader = new ColladaLoader(this.loadingManager);
    this.textureLoader = new Three.TextureLoader();

    this.textures = {
      'mahogany-body': this.textureLoader.load('scenes/textures/mahogany.jpg'),
      'walnut-body': this.textureLoader.load('scenes/textures/sapele.jpg'),
      'swamp-ash-body': this.textureLoader.load('scenes/textures/spruce.jpg'),
      'west-red-cedar-body': this.textureLoader.load('scenes/textures/flamedMaple.jpg'),
      'poplar-body': this.textureLoader.load('scenes/textures/quiltedMaple.jpg'),
    };

    this.currentTexture = this.textures['mahogany-body'];

    this.material = new Three.MeshPhongMaterial({
      shininess: 40,
      map: this.textures['mahogany-body'],
      // envMap: reflectionCube,
      combine: Three.MixOperation,
      reflectivity: 0.12,
    });

    this.models = {};
  }

  getRendererElement() {
    return this.renderer.domElement;
  }

  update(data) {
    // TODO: Auto-retrieval/constants?
    const bodyStyle = data['body-style'];
    const bodyWood = data['body-wood'];

    this.currentTexture = this.textures[bodyWood] || this.currentTexture;
    this.setModel(this.models[bodyStyle] || this.models.archtop);
  }

  async createScene() {
    this.renderer = new Three.WebGLRenderer();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.scene = new Three.Scene();
    this.camera = new Three.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, -50, 0);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.ambientLight = new Three.AmbientLight(0xcccccc, 1);
    this.scene.add(this.ambientLight);

    this.directionalLight = new Three.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(1, 1, 0).normalize();
    this.scene.add(this.directionalLight);

    // Load 7 string models
    this.loader.load('scenes/models/archtop_sc.dae', (collada) => {
      this.models.archtopSingleCut = collada.scene;
      this.models['7-string-standard-scale'] = this.models.archtopSingleCut;
      this.models['7-string-multi-scale'] = this.models.archtopSingleCut;
    });

    // Load 8 string models
    this.loader.load('scenes/models/archtop_fc.dae', (collada) => {
      this.models.archtopFancyCut = collada.scene;
      this.models['8-string-multi-scale'] = this.models.archtopFancyCut;
    });

    // Load 6 string models
    this.loader.load('scenes/models/archtop.dae', (collada) => {
      this.models.archtop = collada.scene;

      this.models['6-string-standard-scale'] = this.models.archtop;
      this.models['6-string-multi-scale'] = this.models.archtop;
      this.setModel(this.models.archtop);
      this.update(this.data);
      this.animate();
    });

    window.addEventListener('resize', this.resize, false);
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
}

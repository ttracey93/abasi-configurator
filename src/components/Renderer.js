import * as Three from 'three';
import ColladaLoader from 'three-collada-loader';
import OrbitControls from 'three-orbitcontrols';

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
    this.loader = new ColladaLoader(this.loadingManager);
    this.textureLoader = new Three.TextureLoader();

    this.textures = {
      'mahogany-body': this.loadTexture('scenes/textures/mahogany.jpg'),
      'walnut-body': this.loadTexture('scenes/textures/sapele.jpg'),
      'swamp-ash-body': this.loadTexture('scenes/textures/spruce.jpg'),
      'west-red-cedar-body': this.loadTexture('scenes/textures/flamedMaple.jpg'),
      'poplar-body': this.loadTexture('scenes/textures/quiltedMaple.jpg'),
      'wenge-body': this.loadTexture('scenes/textures/mahogany.jpg'),
    };

    this.currentTexture = this.textures['mahogany-body'];

    // Load reflection map
    const urls = [
      'scenes/reflection/0001.png',
      'scenes/reflection/0002.png',
      'scenes/reflection/0003.png',
      'scenes/reflection/0004.png',
      'scenes/reflection/0005.png',
      'scenes/reflection/0006.png',
    ];

    this.reflectionCube = new Three.CubeTextureLoader().load(urls);

    this.material = new Three.MeshPhongMaterial({
      shininess: 40,
      map: this.textures['mahogany-body'],
      envMap: this.reflectionCube,
      combine: Three.MixOperation,
      reflectivity: 0.12,
    });

    this.models = {};
  }

  getRendererElement() {
    return this.renderer.domElement;
  }

  getTextureImage(key) {
    console.log(key);
    if (this.textures[key]) {
      return this.textures[key].image;
    }
  }

  update(data) {
    // TODO: Auto-retrieval/constants?
    const bodyStyle = data['body-style'];
    const bodyWood = data['body-wood'];

    if (bodyStyle) {
      this.scene.remove(this.models.fretboard);
      this.scene.remove(this.models.fannedFretboard);
      this.scene.remove(this.models.frets);
      this.scene.remove(this.models.fretsFanned);
      this.scene.remove(this.models.neck);
      this.scene.remove(this.models.neckFanned);

      this.currentFretboardModel = bodyStyle.includes('multi') ? this.models.fannedFretboard : this.models.fretboard;
      this.currentFretsModel = bodyStyle.includes('multi') ? this.models.fretsFanned : this.models.frets;
      this.currentNeckModel = bodyStyle.includes('multi') ? this.models.neckFanned : this.models.neck;

      this.scene.add(this.currentFretboardModel);
      this.scene.add(this.currentNeckModel);
      this.scene.add(this.currentFretsModel);
    }

    this.currentTexture = this.textures[bodyWood] || this.currentTexture;
    this.setModel(this.models[bodyStyle] || this.models.archtop);
  }

  async createScene() {
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

    // Load neck/fretboard/headstock/strings
    this.loader.load('scenes/models/neck.dae', (collada) => {
      this.models.neck = collada.scene;
      this.currentNeckModel = this.models.neck;

      this.scene.add(this.currentNeckModel);

      this.models.neck.traverse((node) => {
        if (node.isMesh) {
          node.material.map = this.textures['mahogany-body'];
        }
      });
    });

    // Load neck/fretboard/headstock/strings
    this.loader.load('scenes/models/neck_fanned.dae', (collada) => {
      this.models.neckFanned = collada.scene;

      this.models.neckFanned.traverse((node) => {
        if (node.isMesh) {
          node.material.map = this.textures['mahogany-body'];
        }
      });
    });

    this.loader.load('scenes/models/frets.dae', (collada) => {
      this.models.frets = collada.scene;
      this.currentFretsModel = this.models.frets;

      this.scene.add(this.currentFretsModel);
    });

    this.loader.load('scenes/models/frets_fanned.dae', (collada) => {
      this.models.fretsFanned = collada.scene;
      this.currentFretsFannedModel = this.models.fretsFanned;

      // this.scene.add(this.currentFretsModel);
    });

    this.loader.load('scenes/models/fretboard.dae', (collada) => {
      this.models.fretboard = collada.scene;
      this.currentFretboardModel = this.models.fretboard;

      this.scene.add(this.currentFretboardModel);

      this.models.fretboard.traverse((node) => {
        if (node.isMesh) {
          node.material.map = this.textures['swamp-ash-body'];
        }
      });
    });

    this.loadModel('scenes/models/fretboard_fanned.dae', (collada) => {
      this.models.fannedFretboard = collada.scene;
      this.currentFannedFretboardModel = this.models.fannedFretboard;

      // this.scene.add(this.currentFretboardModel);

      this.models.fannedFretboard.traverse((node) => {
        if (node.isMesh) {
          node.material.map = this.textures['swamp-ash-body'];
        }
      });
    });

    this.loader.load('scenes/models/headstock.dae', (collada) => {
      this.models.headstock = collada.scene;
      this.currentHeadstockModel = this.models.headstock;

      this.scene.add(this.currentHeadstockModel);

      this.models.headstock.traverse((node) => {
        if (node.isMesh) {
          node.material.map = this.textures['mahogany-body'];
        }
      });
    });

    this.loader.load('scenes/models/strings.dae', (collada) => {
      this.models.strings = collada.scene;
      this.currentStringsModel = this.models.strings;

      this.scene.add(this.currentStringsModel);
    });

    this.loadModel('scenes/models/waverly-no-metal.dae', collada => this.scene.add(collada.scene));
    this.loadModel('scenes/models/dome.dae', collada => this.scene.add(collada.scene));
    this.loadModel('scenes/models/ring.dae', collada => this.scene.add(collada.scene));
    this.loadModel('scenes/models/bk-mule.dae', collada => this.scene.add(collada.scene));
    this.loadModel('scenes/models/nut.dae', collada => this.scene.add(collada.scene));
    this.loadModel('scenes/models/trapeze.dae', collada => this.scene.add(collada.scene));
    this.loadModel('scenes/models/ebony.dae', collada => this.scene.add(collada.scene));

    window.addEventListener('resize', this.resize, false);
  }

  loadModel(path, cb) {
    new ColladaLoader().load(path, cb);
  }

  loadTexture(path) {
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

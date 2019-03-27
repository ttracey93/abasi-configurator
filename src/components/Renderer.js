import ColladaLoader from 'three-collada-loader';
import FBXLoader from 'three-fbxloader-offical';
import OBJLoader from 'three-obj-loader';
import OrbitControls from 'three-orbitcontrols';

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
  }

  getRendererElement() {
    return this.renderer.domElement;
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
    this.camera = new Three.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 25, -50);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.scene.background = new Three.Color( 0x000000 );
    this.scene.fog = new Three.Fog( 0xa0a0a0, 200, 1000 );

    let light = new Three.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 100, 0 );
    this.scene.add( light );

    light = new Three.DirectionalLight( 0xffffff );
    light.position.set( 0, 25, 0 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    this.scene.add( light );

    const grid = new Three.GridHelper( 2000, 20, 0xffffff, 0xffffff );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add( grid );

    this.loadModel('abasi/raw.fbx', fbx => {
      fbx.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      fbx.position.y = 15;
      fbx.position.x = 30;
      fbx.rotation.x = - Math.PI / 2;

      this.camera.lookAt(fbx.position);
      this.scene.add(fbx);
    });

    this.loadModelOBJ('new/guitar/original/source/G_LP_READY.obj', obj => {
      obj.position.z = 200;
      obj.rotation.x = Math.PI / 2;
      obj.rotation.z = Math.PI;

      // For any meshes in the model, add our material.
      obj.traverse( ( node ) => {

        if ( node.isMesh ) node.material = this.diffuseMaterial;

      });

      this.scene.add(obj);
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
}

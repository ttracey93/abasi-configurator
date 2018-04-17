import React from 'react';
import PropTypes from 'prop-types';

import * as Three from 'three';
import BinaryLoader from '../helpers/BinaryLoader';

import Modes from '../constants/modes';

import Price from './Price';

export default class Viewport extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.rotate = this.rotate.bind(this);
    this.purchase = this.purchase.bind(this);
    this.animate = this.animate.bind(this);

    this.scene = new Three.Scene();
    this.ambientLight = new Three.AmbientLight(0x050505);
    this.scene.add(this.ambientLight);

    this.veyron = {
      name: 'Bugatti Veyron',
      url: '/obj/veyron.json',
      author: '<a href="http://artist-3d.com/free_3d_models/dnm/model_disp.php?uid=1129" target="_blank" rel="noopener">Troyano</a>',
      init_rotation: [0, 0, 0],
      scale: 5.5,
      init_material: 4,
      body_materials: [2],

      object: null,
      buttons: null,
      materials: null,
    };
  }

  componentDidMount() {
    this.initScene();
    this.animate();
  }

  handleChange(data) {
    this.props.setData(data);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  rotate() {
    console.log('rotated');
  }

  purchase() {
    this.changeMode(Modes.CONFIRMATION);
  }

  initScene() {
    this.container = document.getElementById('viewport-thing');

    console.log(this.container);

    this.camera = new Three.PerspectiveCamera(70, this.container.innerWidth / this.container.innerHeight, 1, 100000);

    let directionalLight;
    let pointLight;

    this.mouseX = 0;
    this.mouseY = 0;
    const containerHalfX = this.container.innerWidth / 2;
    const containerHalfY = this.container.innerHeight / 2;
    const loader = new BinaryLoader();

    // TextureCube
    const textureCube = new Three.CubeTextureLoader()
      .setPath('/Bridge2/')
      .load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);

    // SCENE
    this.scene = new Three.Scene();
    this.scene.background = textureCube;

    // LIGHTS

    const ambient = new Three.AmbientLight(0x050505);
    this.scene.add(ambient);

    directionalLight = new Three.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 1.2, 10).normalize();
    this.scene.add(directionalLight);

    directionalLight = new Three.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-2, 1.2, -10).normalize();
    this.scene.add(directionalLight);

    pointLight = new Three.PointLight(0xffaa00, 2);
    pointLight.position.set(2000, 1200, 10000);
    this.scene.add(pointLight);

    this.renderer = new Three.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.container.appendChild(this.renderer.domElement);

    // document.addEventListener('mousemove', onDocumentMouseMove, false);

    // common materials

    this.mlib = {
      Orange: new Three.MeshLambertMaterial({
        color: 0xff6600, envMap: textureCube, combine: Three.MixOperation, reflectivity: 0.3,
      }),
      Blue: new Three.MeshLambertMaterial({
        color: 0x001133, envMap: textureCube, combine: Three.MixOperation, reflectivity: 0.3,
      }),
      Red: new Three.MeshLambertMaterial({
        color: 0x660000, envMap: textureCube, combine: Three.MixOperation, reflectivity: 0.25,
      }),
      Black: new Three.MeshLambertMaterial({
        color: 0x000000, envMap: textureCube, combine: Three.MixOperation, reflectivity: 0.15,
      }),
      White: new Three.MeshLambertMaterial({
        color: 0xffffff, envMap: textureCube, combine: Three.MixOperation, reflectivity: 0.25,
      }),

      Carmine: new Three.MeshPhongMaterial({
        color: 0x770000, specular: 0xffaaaa, envMap: textureCube, combine: Three.MultiplyOperation,
      }),
      Gold: new Three.MeshPhongMaterial({
        color: 0xaa9944, specular: 0xbbaa99, shininess: 50, envMap: textureCube, combine: Three.MultiplyOperation,
      }),
      Bronze: new Three.MeshPhongMaterial({
        color: 0x150505, specular: 0xee6600, shininess: 10, envMap: textureCube, combine: Three.MixOperation, reflectivity: 0.25,
      }),
      Chrome: new Three.MeshPhongMaterial({
        color: 0xffffff, specular: 0xffffff, envMap: textureCube, combine: Three.MultiplyOperation,
      }),

      'Orange metal': new Three.MeshLambertMaterial({ color: 0xff6600, envMap: textureCube, combine: Three.MultiplyOperation }),
      'Blue metal': new Three.MeshLambertMaterial({ color: 0x001133, envMap: textureCube, combine: Three.MultiplyOperation }),
      'Red metal': new Three.MeshLambertMaterial({ color: 0x770000, envMap: textureCube, combine: Three.MultiplyOperation }),
      'Green metal': new Three.MeshLambertMaterial({ color: 0x007711, envMap: textureCube, combine: Three.MultiplyOperation }),
      'Black metal': new Three.MeshLambertMaterial({ color: 0x222222, envMap: textureCube, combine: Three.MultiplyOperation }),

      'Pure chrome': new Three.MeshLambertMaterial({ color: 0xffffff, envMap: textureCube }),
      'Dark chrome': new Three.MeshLambertMaterial({ color: 0x444444, envMap: textureCube }),
      'Darker chrome': new Three.MeshLambertMaterial({ color: 0x222222, envMap: textureCube }),

      'Black glass': new Three.MeshLambertMaterial({
        color: 0x101016, envMap: textureCube, opacity: 0.975, transparent: true,
      }),
      'Dark glass': new Three.MeshLambertMaterial({
        color: 0x101046, envMap: textureCube, opacity: 0.25, transparent: true,
      }),
      'Blue glass': new Three.MeshLambertMaterial({
        color: 0x668899, envMap: textureCube, opacity: 0.75, transparent: true,
      }),
      'Light glass': new Three.MeshBasicMaterial({
        color: 0x223344, envMap: textureCube, opacity: 0.25, transparent: true, combine: Three.MixOperation, reflectivity: 0.25,
      }),

      'Red glass': new Three.MeshLambertMaterial({ color: 0xff0000, opacity: 0.75, transparent: true }),
      'Yellow glass': new Three.MeshLambertMaterial({ color: 0xffffaa, opacity: 0.75, transparent: true }),
      'Orange glass': new Three.MeshLambertMaterial({ color: 0x995500, opacity: 0.75, transparent: true }),

      'Orange glass 50': new Three.MeshLambertMaterial({ color: 0xffbb00, opacity: 0.5, transparent: true }),
      'Red glass 50': new Three.MeshLambertMaterial({ color: 0xff0000, opacity: 0.5, transparent: true }),

      'Fullblack rough': new Three.MeshLambertMaterial({ color: 0x000000 }),
      'Black rough': new Three.MeshLambertMaterial({ color: 0x050505 }),
      'Darkgray rough': new Three.MeshLambertMaterial({ color: 0x090909 }),
      'Red rough': new Three.MeshLambertMaterial({ color: 0x330500 }),

      'Darkgray shiny': new Three.MeshPhongMaterial({ color: 0x000000, specular: 0x050505 }),
      'Gray shiny': new Three.MeshPhongMaterial({ color: 0x050505, shininess: 20 }),

    };

    // Veyron materials

    this.veyron.materials = {
      body: [
        ['Orange metal', this.mlib['Orange metal']],
        ['Blue metal', this.mlib['Blue metal']],
        ['Red metal', this.mlib['Red metal']],
        ['Green metal', this.mlib['Green metal']],
        ['Black metal', this.mlib['Black metal']],

        // Separate storage
        ['Gold', this.mlib.Gold],
        ['Bronze', this.mlib.Bronze],
        ['Chrome', this.mlib.Chrome],
      ],
    };

    this.m = this.veyron.materials;
    this.mi = this.veyron.init_material;

    loader.load(this.veyron.url, (geometry) => { this.createScene(geometry); });
  }

  createScene(geometry) {
    geometry.sortFacesByMaterialIndex();

    const m = [];
    const s = this.veyron.scale * 1;
    const r = this.veyron.init_rotation;
    const { materials } = this.veyron;
    // const mi = this.veyron.init_material;
    const bm = this.veyron.body_materials;

    for (const i in this.veyron.mmap) {
      m[i] = this.veyron.mmap[i];
    }

    const mesh = new Three.Mesh(geometry, m);

    mesh.rotation.x = r[0];
    mesh.rotation.y = r[1];
    mesh.rotation.z = r[2];

    mesh.scale.x = mesh.scale.y = mesh.scale.z = s;

    this.scene.add(mesh);

    this.veyron.object = mesh;

    // CARS[car].buttons = createButtons(materials.body, car);
    // attachButtonMaterials(materials.body, m, bm, car);
    // switchCar(car);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderWebgl();
  }

  renderWebgl() {
    const timer = -0.0002 * Date.now();

    this.camera.position.x = 1000 * Math.cos(timer);
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
    this.camera.position.z = 1000 * Math.sin(timer);

    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);

    // this.camera.position.x = 1000;
    // this.camera.position.y = 1000;
    // this.camera.position.z = 1000;

    // this.camera.lookAt(this.scene.position);

    // this.renderer.render(this.scene, this.camera);
  }

  render() {
    const viewData = Object.assign({}, this.props.data);
    delete viewData.items;

    return (
      <div className="container evenly viewport">
        <div className="viewport-view">
          Viewport

          <div><pre>{JSON.stringify(viewData, null, 2)}</pre></div>
        </div>

        {this.props.reset && (
          <div className="reset-button">
            <button className="btn" onClick={this.props.reset}>
              Reset
            </button>
          </div>
        )}

        <div className="rotate-button">
          <button className="btn" onClick={this.rotate}>
            Rotate
          </button>
        </div>

        <div className="purchase-button">
          <button className="btn" onClick={this.purchase}>
            Purchase
          </button>
        </div>

        <div className="viewport-price">
          <Price data={this.props.data} changeMode={this.changeMode} />
        </div>
      </div>
    );
  }
}

Viewport.propTypes = {
  reset: PropTypes.func,
  setData: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};


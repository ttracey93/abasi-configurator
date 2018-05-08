import React from 'react';
import PropTypes from 'prop-types';

import * as Three from 'three';
import ColladaLoader from 'three-collada-loader';
import OrbitControls from 'three-orbitcontrols';

import Price from './Price';
import Modes from '../constants/modes';

export default class Viewport extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.rotate = this.rotate.bind(this);
    this.purchase = this.purchase.bind(this);
    this.animate = this.animate.bind(this);

    this.containerRef = React.createRef();
    this.loader = new ColladaLoader(this.loadingManager);
    this.textureLoader = new Three.TextureLoader();

    this.mahogany = this.textureLoader.load('scenes/textures/sapele.jpg');
    this.mahogany.wrapS = Three.RepeatWrapping;
    this.mahogany.wrapT = Three.RepeatWrapping;
    // this.mahogany.repeat.set(4, 4);
    console.log(this.mahogany);
  }

  componentDidMount() {
    this.container = this.containerRef.current;
    this.createScene().then(() => {
      this.animate();
    });
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

  async createScene() {
    console.log(this.container);
    console.log(this.container.clientWidth);
    console.log(this.container.clientHeight);

    this.renderer = new Three.WebGLRenderer();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new Three.Scene();
    this.camera = new Three.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, -120, 80);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.ambientLight = new Three.AmbientLight(0xcccccc, 0.4);
    this.scene.add(this.ambientLight);

    this.directionalLight = new Three.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(1, 1, 0).normalize();
    this.scene.add(this.directionalLight);

    this.loader.load('scenes/models/body.dae', (collada) => {
      collada.scene.traverse((node) => {
        if (node.isMesh) {
          node.material.map = this.mahogany;
        }
      });

      this.scene.add(collada.scene);
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }, false);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderScene();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    const viewData = Object.assign({}, this.props.data);
    delete viewData.items;

    return (
      <div className="container evenly viewport">
        <div ref={(this.containerRef)} className="viewport-view" />

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

        <div className="viewport-price">
          <Price data={this.props.data} changeMode={this.changeMode} />
        </div>
      </div>
    );
  }
}

Viewport.propTypes = {
  reset: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};


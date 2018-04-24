import React from 'react';
import PropTypes from 'prop-types';

import * as Babylon from 'babylonjs';
import 'babylonjs-loaders';

import Price from './Price';
import Modes from '../constants/modes';

export default class Viewport extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.rotate = this.rotate.bind(this);
    this.purchase = this.purchase.bind(this);
  }

  componentDidMount() {
    this.createScene().then(() => {
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });

      window.addEventListener('resize', () => {
        this.engine.resize();
      });
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
    this.camera.position = new Babylon.Vector3(0, 0, 0);
  }

  async createScene() {
    this.canvas = document.getElementById('render-canvas');
    this.engine = new Babylon.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });

    await new Promise((resolve, reject) => {
      Babylon.SceneLoader.Load('scenes/', 'stratocaster.obj', this.engine, (scene) => {
        this.scene = scene;
        console.log(this.scene);

        // Adding a light
        this.light = new Babylon.PointLight('Omni', new Babylon.Vector3(20, 20, 100), this.scene);

        // Adding an Arc Rotate Camera
        this.camera = new Babylon.ArcRotateCamera('Camera', 0, 1.5, 100, Babylon.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);

        // Move the light with the camera
        this.scene.registerBeforeRender(() => {
          this.light.position = this.camera.position;
        });

        resolve();
      });
    });


    return this.scene;
  }

  purchase() {
    this.changeMode(Modes.CONFIRMATION);
  }

  render() {
    const viewData = Object.assign({}, this.props.data);
    delete viewData.items;

    return (
      <div className="container evenly viewport">
        <div className="viewport-view">
          <canvas id="render-canvas" />
        </div>

        {/* {this.props.reset && (
          <div className="reset-button">
            <button className="btn" onClick={this.props.reset}>
              Reset
            </button>
          </div>
        )} */}

        <div className="rotate-button">
          <button className="btn" onClick={this.rotate}>
            Rotate
          </button>
        </div>

        <div className="back-button">
          <button className="btn" disabled={this.props.itemIndex === 0} onClick={this.props.goBack}>
            Previous
          </button>
        </div>

        {/* <div className="forward-button">
          <button className="btn" onClick={this.props.goForward}>
            Next
          </button>
        </div> */}

        <div className="viewport-price">
          <Price data={this.props.data} changeMode={this.changeMode} />
        </div>
      </div>
    );
  }
}

Viewport.propTypes = {
  // reset: PropTypes.func,
  setData: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  itemIndex: PropTypes.number.isRequired,
};


import React from 'react';

import STRINGS from './constants/strings';
import SCALE from './constants/scale';
import HEADSTYLE from './constants/headstyle';

import './Configurator.css';

import HomeView from './components/HomeView';

export default class Configurator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      strings: STRINGS.SIX,
      scale: SCALE.STANDARD,
      headstyle: HEADSTYLE.HEADSTOCK,
    };
  }

  render() {
    return (
      <div className="configurator">
        <HomeView />
      </div>

    );
  }
}

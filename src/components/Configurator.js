import React from 'react';

import STRINGS from '../constants/strings';
import SCALE from '../constants/scale';
import HEADSTYLE from '../constants/headstyle';

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
      <div>
        <p>{this.state.strings}</p>
        <p>{this.state.scale}</p>
        <p>{this.state.headstyle}</p>

        <p>There will be a Configurator here!</p>
      </div>
    );
  }
}

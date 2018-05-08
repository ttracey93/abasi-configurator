import React from 'react';

export default class Info extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      something: undefined,
    };
  }

  render() {
    return this.state.something || 'Info pane';
  }
}

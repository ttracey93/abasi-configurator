import React from 'react';

import Tile from './Tile';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="abasi-dashboard flex">
        <div className="abasi-dashboard-tiles flex">
          <Tile title="Orders" url="/orders" />
          <Tile title="Manage Assets" url="/assets" />
          <Tile title="Manage Active Config" url="/config" />
          <Tile title="Rollback Configuration" url="/archive" />
        </div>
      </div>
    );
  }
}

export default Home;

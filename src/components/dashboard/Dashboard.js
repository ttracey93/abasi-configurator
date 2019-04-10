import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import Orders from './Orders';
import OrderListing from './OrderListing';
import ManageAssets from './ManageAssets';

const Dashboard = ({ user }) => (
  <div className="flex">
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/orders" component={Orders} />
      <Route exact path="/orders/:id" component={OrderListing} />
      <Route exact path="/assets" component={ManageAssets} />
      <Route exact path="/config" component={Home} />
      <Route exact path="/archive" component={Home} />
    </Switch>
  </div>
);

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Dashboard;
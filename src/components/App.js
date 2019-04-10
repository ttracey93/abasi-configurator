import React from 'react';
import PropTypes from 'prop-types';
import Configurator from './Configurator';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router, Route, Switch, withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';

import Header from './Header';
// import Footer from './Footer';
import Welcome from './Welcome';
import Dashboard from './dashboard/Dashboard';

import '../styles/app.css';

import * as actions from '../actions/auth';

const App = ({
  user,
}) => {
  return (
    <Router>
      <div className="flex columns">
        {/* Notification Container */}
        <ToastContainer
          className='toast-container'
          toastClassName="dark-toast"
          progressClassName='toast-progress'
        />

        <Header user={user} />

        <div className="flex app-body">
          {!user &&
            <Welcome />
          }

          {user &&
            <Route path="/" render={props => <Dashboard {...props} user={user} />} />
          }

          {/* <Route path="/" render={props => <Dashboard {...props} user={user} />} /> */}

          {/* Everyone can see the Configurator for now */}
          <Route exact path="/embed" component={Configurator} />
        </div>

        {/* <Footer /> */}
      </div>
    </Router>
  );
};

App.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default withRouter(connect(
  mapStateToProps,
  actions,
)(App));

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Configurator from './Configurator';
import registerServiceWorker from './registerServiceWorker';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router, Route, withRouter, Switch, Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import Welcome from './Welcome';
import './styles/app.css';

import * as actions from './actions/auth';

const App = ({
  user, login, logout, initUser,
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

        <Header user={user}></Header>

        <div className="flex app-body">
          <Route exact path="/embed" component={Configurator} />

          {!user &&
            <Route exact path="/welcome" component={Welcome} />
          }

          {user &&
            <Route exact path="/" component={Welcome} />
          }
        </div>

        <Footer></Footer>
      </div>
    </Router>
  );
};

App.propTypes = {
  user: PropTypes.object,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default withRouter(connect(
  mapStateToProps,
  actions,
)(App));

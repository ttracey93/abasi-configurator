import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, login, logout }) => (
  <div className="app-bar">
    <Link to="/" className="brand-logo">
      <img src="/logo.png" />
    </Link>

    {user && (
      <span className="flex app-actions">
        <div className="active-user">
          {user.displayName}
        </div>

        <a className="logout-button" onClick={logout}>
          <i className="fa fa-sign-out login-icon"></i>
          Logout
        </a>
      </span>
    )}

    {!user && (
      <span className="flex app-actions">
        <a onClick={login} className="login-button">
          <i className="fa fa-google login-icon"></i>
          Login with Google
        </a>
      </span>
)}
  </div>
);

export default Header;
import React from 'react';
import { Link } from 'react-router-dom';

const reload = () => {
  window.location.reload(false);
}

const Header = ({ user }) => (
  <div className="app-bar">
    <Link to="/" className="brand-logo">
      <img src="/logo.png" alt="Abasi Logo" />
    </Link>

    {user && (
      <span className="app-actions">
        <span className="active-user">
          {user.email}
        </span>
        
        <button className="abasi-logout" onClick={reload}>
          Logout
        </button>
      </span>
    )}
  </div>
);

export default Header;
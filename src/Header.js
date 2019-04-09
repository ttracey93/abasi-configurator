import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user }) => (
  <div className="app-bar">
    <Link to="/" className="brand-logo">
      <img src="/logo.png" />
    </Link>

    {user && (
      <span className="flex app-actions">
        <div className="active-user">
          {user.displayName}
        </div>
      </span>
    )}
  </div>
);

export default Header;
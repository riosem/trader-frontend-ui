import React from 'react';
import './Header.css';
import { useAuth } from 'auth/useAuth';


const Header = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  return (
    <header className="app-header">
      <h1>Trading Metrics Dashboard</h1>
      <div className="auth-controls">
        {isAuthenticated ? (
          <>
            <span>Welcome, {user?.name || user?.email}!</span>
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>
    </header>
  );
};

export default Header;
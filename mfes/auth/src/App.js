import React from 'react';
import { useAuth } from './components/AuthProvider';

const App = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
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
  );
};

export default App;

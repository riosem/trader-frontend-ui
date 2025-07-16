import React, { createContext, useContext, useCallback } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.PROXY_API_BASE_URL || !process.env.AUTH0_SCOPE) {
    throw new Error('Missing environment variables.');
  }

  console.log('Loading variables...');
  return (
    <Auth0Provider
      domain={process.env.AUTH0_DOMAIN}
      clientId={process.env.AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.PROXY_API_BASE_URL,
        scope: process.env.AUTH0_SCOPE,
      }}
    >
      <AuthWrapper>{children}</AuthWrapper>
    </Auth0Provider>
  );
};

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();

  const login = useCallback(() => loginWithRedirect(), [loginWithRedirect]);
  const logoutWithRedirect = () =>
      logout({ logoutParams: { returnTo: window.location.origin } });

  return (
      <AuthContext.Provider
          value={{ isAuthenticated, user, login, logout: logoutWithRedirect, getAccessTokenSilently }}
      >
          {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

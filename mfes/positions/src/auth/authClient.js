import React from "react";

const useMockAuth = process.env.LOCAL_DEV === "true";

let useAuth;

if (useMockAuth) {
  // Fallback mock implementation
  useAuth = () => ({
    isAuthenticated: true,
    login: () => {
      console.log("Mock login");
    },
    getAccessTokenSilently: async () => "fake-token",
    user: null,
    logout: () => {
      console.log("Mock logout");
    },
  });
} else {
  useAuth = require('auth/useAuth');
}

export { useAuth };

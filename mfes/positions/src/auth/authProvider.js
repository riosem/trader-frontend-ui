import React from "react";

const useMockAuth = process.env.LOCAL_DEV === "true";

let AuthProvider;

if (useMockAuth) {

  AuthProvider = ({ children }) => {
    return <>{children}</>;
  };
} else {
  AuthProvider = require('auth/AuthProvider');
}
export { AuthProvider };

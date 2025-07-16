import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import { AuthProvider } from 'auth/AuthProvider'; // Import from auth microfrontend


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
);

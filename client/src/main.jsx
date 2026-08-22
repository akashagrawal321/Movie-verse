/**
 * @file main.jsx
 * @description React Client Main Entry Point
 * 
 * Beginner Explanation:
 * Mounts the root React component tree into the DOM (#root element in index.html).
 * Wraps the App component with BrowserRouter (for client-side routing)
 * and AuthProvider (for global authentication context).
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);

/**
 * @file LoadingSpinner.jsx
 * @description Reusable animated loading spinner component
 */

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="spinner-container">
            <div className="spinner-ring"></div>
            <p className="spinner-message">{message}</p>
        </div>
    );
};

export default LoadingSpinner;

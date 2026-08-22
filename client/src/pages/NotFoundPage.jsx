/**
 * @file NotFoundPage.jsx
 * @description 404 Not Found Page Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-card">
                <div className="error-code">404</div>
                <h2>Page Not Found</h2>
                <p>The cinema reel you are looking for doesn't exist or has been moved.</p>
                <Link to="/" className="btn btn-primary">
                    🎬 Return to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;

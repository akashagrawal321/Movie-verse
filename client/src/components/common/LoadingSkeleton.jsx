/**
 * @file LoadingSkeleton.jsx
 * @description Pure CSS Loading Skeleton Component for async content placeholders
 */

import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = 'card', count = 4 }) => {
    const items = Array.from({ length: count });

    if (type === 'card') {
        return (
            <div className="skeleton-grid">
                {items.map((_, idx) => (
                    <div key={idx} className="skeleton-card">
                        <div className="skeleton-thumb shimmer"></div>
                        <div className="skeleton-title shimmer"></div>
                        <div className="skeleton-sub shimmer"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="skeleton-container">
            {items.map((_, idx) => (
                <div key={idx} className="skeleton-line shimmer"></div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;

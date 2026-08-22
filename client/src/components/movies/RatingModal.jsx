/**
 * @file RatingModal.jsx
 * @description Interactive 10-Star Rating & User Review Modal for MovieVerse Pro
 */

import React, { useState } from 'react';
import './RatingModal.css';

const RatingModal = ({ isOpen, onClose, movieTitle, currentRating, onRateSubmit }) => {
    const [selectedStars, setSelectedStars] = useState(10);
    const [hoverStars, setHoverStars] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onRateSubmit(selectedStars, reviewText);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="rating-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="rating-modal-header">
                    <h3>Rate & Review: {movieTitle}</h3>
                    <button className="rating-close-btn" onClick={onClose}>✕</button>
                </div>

                {submitted ? (
                    <div className="rating-success-box">
                        <div className="success-icon">🌟</div>
                        <h4>Thank You for Rating!</h4>
                        <p>Your rating of <strong>{selectedStars}/10 Stars</strong> has been posted to MovieVerse Pro.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="rating-modal-body">
                        <p className="rating-instruction">How would you rate your experience for <strong>{movieTitle}</strong>?</p>

                        {/* Interactive Star Picker (10 Stars) */}
                        <div className="stars-picker-row">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`star-btn ${star <= (hoverStars || selectedStars) ? 'active' : ''}`}
                                    onClick={() => setSelectedStars(star)}
                                    onMouseEnter={() => setHoverStars(star)}
                                    onMouseLeave={() => setHoverStars(0)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <div className="selected-rating-display">
                            <span className="star-score">⭐ {hoverStars || selectedStars} / 10</span>
                            <span className="rating-label">
                                {(hoverStars || selectedStars) >= 9 ? 'Masterpiece 🏆' : (hoverStars || selectedStars) >= 7 ? 'Very Good 👍' : (hoverStars || selectedStars) >= 5 ? 'Average 😐' : 'Disappointing 👎'}
                            </span>
                        </div>

                        {/* Optional User Review Input */}
                        <div className="review-input-group">
                            <label>Write your review (Optional):</label>
                            <textarea
                                rows="3"
                                placeholder="What did you like or dislike about this film?"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="review-textarea"
                            />
                        </div>

                        {/* Actions */}
                        <div className="rating-modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Submit Rating ⭐
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RatingModal;

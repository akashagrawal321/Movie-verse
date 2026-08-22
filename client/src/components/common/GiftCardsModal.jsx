/**
 * @file GiftCardsModal.jsx
 * @description Interactive Digital Gift Cards Modal for MovieVerse Pro
 */

import React, { useState } from 'react';
import './GiftCardsModal.css';

const giftAmounts = [250, 500, 1000, 2500];

const cardThemes = [
    { id: 'gold', name: 'Blockbuster Gold', gradient: 'linear-gradient(135deg, #d4af37, #85581A)', icon: '🎬' },
    { id: 'red', name: 'Cinematic Red', gradient: 'linear-gradient(135deg, #e50914, #800000)', icon: '🎟️' },
    { id: 'neon', name: 'Cyber Neon', gradient: 'linear-gradient(135deg, #00f2fe, #4facfe)', icon: '🍿' },
    { id: 'purple', name: 'Royal Premiere', gradient: 'linear-gradient(135deg, #7f00ff, #e100ff)', icon: '🌟' }
];

const GiftCardsModal = ({ isOpen, onClose }) => {
    const [selectedAmount, setSelectedAmount] = useState(500);
    const [selectedTheme, setSelectedTheme] = useState(cardThemes[0]);
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [personalMessage, setPersonalMessage] = useState('');
    const [purchasedCode, setPurchasedCode] = useState(null);

    if (!isOpen) return null;

    const handlePurchase = (e) => {
        e.preventDefault();
        const randomCode = 'MV-GIFT-' + Math.floor(100000 + Math.random() * 900000);
        setPurchasedCode(randomCode);
    };

    const handleReset = () => {
        setPurchasedCode(null);
        setRecipientName('');
        setRecipientEmail('');
        setPersonalMessage('');
        onClose();
    };

    return (
        <div className="gift-modal-backdrop" onClick={onClose}>
            <div className="gift-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="gift-modal-header">
                    <div className="header-title-box">
                        <span className="gift-modal-icon">🎟️</span>
                        <div>
                            <h3>MovieVerse e-Gift Cards</h3>
                            <p>Send instant digital movie tickets to friends & family</p>
                        </div>
                    </div>
                    <button className="gift-close-btn" onClick={onClose} aria-label="Close">✕</button>
                </div>

                <div className="gift-modal-body">
                    {purchasedCode ? (
                        <div className="gift-success-view">
                            <span className="success-emoji">🎉</span>
                            <h3>Gift Card Issued Successfully!</h3>
                            <p>An e-gift voucher of <strong>₹{selectedAmount}</strong> has been sent to <strong>{recipientEmail || 'your email'}</strong>.</p>

                            <div className="issued-card-preview" style={{ background: selectedTheme.gradient }}>
                                <span className="preview-icon">{selectedTheme.icon}</span>
                                <h4>MovieVerse Gift Card</h4>
                                <span className="preview-amount">₹{selectedAmount}</span>
                                <span className="preview-code">{purchasedCode}</span>
                            </div>

                            <button className="btn btn-primary" onClick={handleReset}>Done</button>
                        </div>
                    ) : (
                        <form onSubmit={handlePurchase} className="gift-card-form">
                            {/* Card Visual Preview */}
                            <div className="card-live-preview" style={{ background: selectedTheme.gradient }}>
                                <div className="preview-top">
                                    <span className="brand-logo">🎬 MovieVerse</span>
                                    <span className="preview-theme-icon">{selectedTheme.icon}</span>
                                </div>
                                <div className="preview-mid">
                                    <span className="recipient-lbl">To: {recipientName || 'Movie Lover'}</span>
                                    <p className="message-snippet">{personalMessage ? `"${personalMessage}"` : 'Enjoy your movie experience!'}</p>
                                </div>
                                <div className="preview-bot">
                                    <span>GIFT VOUCHER</span>
                                    <span className="amount-display">₹{selectedAmount}</span>
                                </div>
                            </div>

                            {/* Select Theme */}
                            <div className="form-section">
                                <label className="form-label">1. Choose Card Theme</label>
                                <div className="themes-grid">
                                    {cardThemes.map((theme) => (
                                        <button
                                            type="button"
                                            key={theme.id}
                                            className={`theme-chip ${selectedTheme.id === theme.id ? 'active' : ''}`}
                                            onClick={() => setSelectedTheme(theme)}
                                        >
                                            {theme.icon} {theme.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Select Amount */}
                            <div className="form-section">
                                <label className="form-label">2. Select Amount</label>
                                <div className="amounts-grid">
                                    {giftAmounts.map((amount) => (
                                        <button
                                            type="button"
                                            key={amount}
                                            className={`amount-chip ${selectedAmount === amount ? 'active' : ''}`}
                                            onClick={() => setSelectedAmount(amount)}
                                        >
                                            ₹{amount}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recipient Details */}
                            <div className="form-section">
                                <label className="form-label">3. Recipient Details</label>
                                <div className="inputs-row">
                                    <input
                                        type="text"
                                        placeholder="Recipient's Name"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        className="gift-input"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Recipient's Email"
                                        value={recipientEmail}
                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                        className="gift-input"
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Add a Personal Note (optional)"
                                    value={personalMessage}
                                    onChange={(e) => setPersonalMessage(e.target.value)}
                                    className="gift-input"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg purchase-btn">
                                🎁 Send ₹{selectedAmount} Gift Card
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GiftCardsModal;

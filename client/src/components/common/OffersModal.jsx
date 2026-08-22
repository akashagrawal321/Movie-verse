/**
 * @file OffersModal.jsx
 * @description Interactive Promo Codes & Deals Modal for MovieVerse Pro
 */

import React, { useState } from 'react';
import './OffersModal.css';

const offersList = [
    {
        id: 'offer-1',
        title: 'Buy 1 Get 1 Free on Movie Tickets',
        code: 'MOVIEVERSE50',
        description: 'Valid on ICICI, HDFC, and Axis Bank Credit/Debit Cards.',
        discount: '50% OFF',
        category: 'Bank Offer',
        expiry: 'Valid till 31 Dec 2026',
        icon: '💳'
    },
    {
        id: 'offer-2',
        title: 'Flat ₹100 Cashback on UPI',
        code: 'PAYTM100',
        description: 'Minimum booking value ₹350 via Paytm or PhonePe UPI.',
        discount: '₹100 Cashback',
        category: 'UPI Offer',
        expiry: 'Valid till 15 Nov 2026',
        icon: '📱'
    },
    {
        id: 'offer-3',
        title: '20% OFF Snack & Popcorn Combos',
        code: 'SNACK20',
        description: 'Applicable on all large popcorn and fountain beverage combos.',
        discount: '20% OFF',
        category: 'Food & Beverage',
        expiry: 'Valid Everyday',
        icon: '🍿'
    },
    {
        id: 'offer-4',
        title: 'Free IMAX 3D Seat Upgrade',
        code: 'IMAXUPGRADE',
        description: 'Book weekend evening shows and get upgraded to IMAX 3D for free.',
        discount: 'FREE UPGRADE',
        category: 'Cinema Special',
        expiry: 'Fri - Sun Only',
        icon: '🎬'
    }
];

const OffersModal = ({ isOpen, onClose }) => {
    const [copiedCode, setCopiedCode] = useState(null);

    if (!isOpen) return null;

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => {
            setCopiedCode(null);
        }, 2500);
    };

    return (
        <div className="offers-modal-backdrop" onClick={onClose}>
            <div className="offers-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="offers-modal-header">
                    <div className="header-title-box">
                        <span className="offers-modal-icon">🎁</span>
                        <div>
                            <h3>Exclusive MovieVerse Offers</h3>
                            <p>Apply promo codes at checkout for instant discounts</p>
                        </div>
                    </div>
                    <button className="offers-close-btn" onClick={onClose} aria-label="Close">✕</button>
                </div>

                <div className="offers-modal-body">
                    {offersList.map((offer) => (
                        <div key={offer.id} className="offer-card-item">
                            <div className="offer-badge-col">
                                <span className="offer-cat-icon">{offer.icon}</span>
                                <span className="offer-discount-tag">{offer.discount}</span>
                            </div>

                            <div className="offer-details-col">
                                <h4>{offer.title}</h4>
                                <p>{offer.description}</p>
                                <span className="offer-expiry">{offer.expiry}</span>
                            </div>

                            <div className="offer-code-col">
                                <span className="code-text">{offer.code}</span>
                                <button
                                    className={`copy-code-btn ${copiedCode === offer.code ? 'copied' : ''}`}
                                    onClick={() => handleCopyCode(offer.code)}
                                >
                                    {copiedCode === offer.code ? 'Copied! 📋' : 'Copy Code'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="offers-modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>Close Offers</button>
                </div>
            </div>
        </div>
    );
};

export default OffersModal;

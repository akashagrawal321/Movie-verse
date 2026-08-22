/**
 * @file Footer.jsx
 * @description Professional BookMyShow-inspired Footer Component with Interactive Contact Us Modal
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ContactUsModal from './ContactUsModal';
import './Footer.css';

const Footer = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <footer className="app-footer">
            <div className="footer-container">
                {/* Upper Promotional Banner */}
                <div className="footer-promo-banner">
                    <div className="promo-text">
                        <span className="promo-icon">🎬</span>
                        <div>
                            <h3>List Your Show on MovieVerse Pro</h3>
                            <p>Got a show, event, movie, or activity? Partner with us and get discovered by millions.</p>
                        </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => setIsContactOpen(true)}>
                        Contact Us
                    </button>
                </div>

                {/* Links Grid */}
                <div className="footer-grid">
                    <div className="footer-brand-col">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">🎬</span>
                            <span className="logo-text">Movie<span className="highlight">Verse Pro</span></span>
                        </Link>
                        <p className="brand-desc">
                            India's premier movie ticketing and entertainment platform. Experience seamless seat booking, real-time cinema showtimes, and instant ticket downloads.
                        </p>
                    </div>

                    <div className="footer-links-col">
                        <h4>Movies Now Showing</h4>
                        <ul>
                            <li><Link to="/movies">Oppenheimer</Link></li>
                            <li><Link to="/movies">Interstellar</Link></li>
                            <li><Link to="/movies">Dune: Part Two</Link></li>
                            <li><Link to="/movies">The Dark Knight</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/movies">Movies</Link></li>
                            <li><Link to="/my-bookings">My Bookings</Link></li>
                            <li><Link to="/wishlist">Wishlist</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h4>Admin & Support</h4>
                        <ul>
                            <li><Link to="/admin">Admin Portal</Link></li>
                            <li><Link to="/login">Sign In</Link></li>
                            <li><Link to="/register">Create Account</Link></li>
                            <li>
                                <button className="footer-link-btn" onClick={() => setIsContactOpen(true)}>
                                    Help Center & Contact
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 MovieVerse Pro. Built for Software Engineering Resume Portfolio.</p>
                    <div className="social-icons">
                        <span onClick={() => setIsContactOpen(true)} title="Support & Contact">🌐</span>
                        <span onClick={() => setIsContactOpen(true)} title="Support & Contact">📱</span>
                        <span onClick={() => setIsContactOpen(true)} title="Support & Contact">✉️</span>
                    </div>
                </div>
            </div>

            {/* Contact Us Interactive Modal */}
            <ContactUsModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </footer>
    );
};

export default Footer;

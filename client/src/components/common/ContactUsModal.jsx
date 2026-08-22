/**
 * @file ContactUsModal.jsx
 * @description Interactive Contact Us & Partner Inquiry Modal Component
 */

import React, { useState } from 'react';
import './ContactUsModal.css';

const ContactUsModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        inquiryType: 'Partner & List Your Show',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 800);
    };

    const handleReset = () => {
        setSubmitted(false);
        setFormData({
            name: '',
            email: '',
            inquiryType: 'Partner & List Your Show',
            subject: '',
            message: ''
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card contact-modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                {!submitted ? (
                    <>
                        <div className="modal-header">
                            <span className="modal-badge-icon">📩</span>
                            <h2>Contact Us & Partner Inquiry</h2>
                            <p>Partner with MovieVerse Pro to list your cinema show, event, or get ticket support.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Your Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="e.g. Rahul Sharma"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="e.g. rahul@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Inquiry Type *</label>
                                <select
                                    name="inquiryType"
                                    value={formData.inquiryType}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="Partner & List Your Show">🎬 Partner & List Your Show / Cinema</option>
                                    <option value="Ticket & Booking Support">🎟️ Ticket & Booking Support</option>
                                    <option value="Corporate & Bulk Booking">💼 Corporate & Bulk Booking</option>
                                    <option value="General Query">💬 General Query</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    placeholder="Brief title of your query..."
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    required
                                    placeholder="Describe your show, theatre details, or issue..."
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary submit-contact-btn" disabled={loading}>
                                {loading ? 'Sending Request...' : 'Send Message 🚀'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="contact-success-box">
                        <div className="success-icon">✅</div>
                        <h3>Message Sent Successfully!</h3>
                        <p>Thank you <strong>{formData.name}</strong> for reaching out to MovieVerse Pro.</p>
                        <div className="ref-ticket-badge">
                            Reference ID: <strong>MV-SUP-{Math.floor(100000 + Math.random() * 900000)}</strong>
                        </div>
                        <p className="sub-note">Our partnerships & support team will respond to <strong>{formData.email}</strong> within 24 hours.</p>
                        <button className="btn btn-primary btn-block" onClick={handleReset}>
                            Close & Return
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactUsModal;

/**
 * @file PartnershipAdSection.jsx
 * @description Dedicated Movie & Brand Partnership Advertising Opportunities Section
 */

import React, { useState } from 'react';
import ContactUsModal from '../common/ContactUsModal';
import './PartnershipAdSection.css';

const PartnershipAdSection = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    const stats = [
        { label: 'Monthly Active Moviegoers', val: '10M+' },
        { label: 'Partner Cinema Screens', val: '500+' },
        { label: 'Avg. In-App View Time', val: '4.8 Min' },
        { label: 'High Intent Conversion', val: '85%' }
    ];

    const packages = [
        {
            icon: '🎥',
            title: 'In-Cinema & Trailer Ads',
            desc: 'Engage high-intent cinema audiences before blockbuster film screenings across 500+ premier screens nationwide.'
        },
        {
            icon: '🎟️',
            title: 'Digital Ticket Sponsorship',
            desc: 'Brand placement on 500,000+ digital PDF ticket receipts, QR passes, and email confirmation vouchers.'
        },
        {
            icon: '🖥️',
            title: 'Homepage Spotlight Takeover',
            desc: 'Dominate MovieVerse Pro home banner billboards with exclusive premiere launches and interactive trailers.'
        },
        {
            icon: '🍿',
            title: 'F&B & Combo Brand Deals',
            desc: 'Co-branded popcorn combos, exclusive discount vouchers, and offline cinema concession stand branding.'
        }
    ];

    return (
        <section className="partnership-ad-section">
            <div className="partnership-container">
                {/* Header Title */}
                <div className="partnership-header">
                    <span className="partnership-badge">🤝 MOVIEVERSE MEDIA & SPONSORSHIPS</span>
                    <h2>Partner & Advertise With MovieVerse Pro</h2>
                    <p>Promote your movie, brand, or campaign to millions of entertainment enthusiasts across digital & cinema touchpoints.</p>
                </div>

                {/* Key Advertising Metrics Grid */}
                <div className="ad-stats-grid">
                    {stats.map((s, idx) => (
                        <div key={idx} className="stat-card">
                            <span className="stat-value">{s.val}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Advertising Packages Grid */}
                <div className="ad-packages-grid">
                    {packages.map((pkg, idx) => (
                        <div key={idx} className="package-card">
                            <div className="package-icon-box">{pkg.icon}</div>
                            <h3>{pkg.title}</h3>
                            <p>{pkg.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Call To Action Card */}
                <div className="partnership-cta-card">
                    <div className="cta-info">
                        <span className="cta-badge">🚀 GROW YOUR AUDIENCE</span>
                        <h3>Ready to Launch Your Movie or Brand Campaign?</h3>
                        <p>Get a custom advertising proposal with audience analytics and targeted screen placement within 24 hours.</p>
                    </div>
                    <button className="btn btn-primary btn-lg launch-campaign-btn" onClick={() => setIsContactOpen(true)}>
                        Launch Advertising Campaign 🚀
                    </button>
                </div>
            </div>

            {/* Interactive Contact & Partnership Modal */}
            <ContactUsModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </section>
    );
};

export default PartnershipAdSection;

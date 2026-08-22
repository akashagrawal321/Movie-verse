/**
 * @file CinematicIntro.jsx
 * @description Premium Luxury Cinema Entry Intro Component
 * Appears only once per browser session using sessionStorage.
 */

import React, { useState, useEffect } from 'react';
import '../css/cinematicIntro.css';

const CinematicIntro = () => {
    const [isVisible, setIsVisible] = useState(() => {
        // Check if intro has already been played in current session
        const hasPlayed = sessionStorage.getItem('introPlayed');
        return !hasPlayed;
    });

    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        if (!isVisible) return;

        // Scene 4 Transition Trigger (at 3.0 sec) -> start fading out
        const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 3000);

        // Completion Trigger (at 3.6 sec) -> remove overlay & set sessionStorage
        const completeTimer = setTimeout(() => {
            handleComplete();
        }, 3600);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [isVisible]);

    const handleComplete = () => {
        sessionStorage.setItem('introPlayed', 'true');
        setIsFadingOut(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 400);
    };

    if (!isVisible) return null;

    return (
        <div className={`cinematic-intro-overlay ${isFadingOut ? 'fade-out' : ''}`}>
            {/* Background Ambient Glow & Vignette */}
            <div className="cinematic-bg-glow" />
            <div className="cinematic-vignette" />

            {/* Scene 2: Cinema Spotlight Sweep */}
            <div className="cinematic-spotlight" />

            {/* CSS Floating Cinematic Particles */}
            <div className="cinematic-particles">
                <div className="particle particle-1" />
                <div className="particle particle-2" />
                <div className="particle particle-3" />
                <div className="particle particle-4" />
                <div className="particle particle-5" />
                <div className="particle particle-6" />
            </div>

            {/* Main Content (Scenes 1-3) */}
            <div className="cinematic-content">
                <div className="cinematic-icon-badge">🎬</div>

                <h1 className="cinematic-title">
                    MOVIEVERSE <span className="cinematic-title-accent">PRO</span>
                </h1>

                {/* Scene 3: Tagline */}
                <div className="cinematic-tagline-container">
                    <span className="cinematic-tagline">
                        Every Ticket Begins With A Story
                    </span>
                </div>
            </div>

            {/* Skip Option */}
            <button className="cinematic-skip-btn" onClick={handleComplete}>
                SKIP INTRO ➔
            </button>
        </div>
    );
};

export default CinematicIntro;

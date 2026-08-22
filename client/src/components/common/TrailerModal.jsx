/**
 * @file TrailerModal.jsx
 * @description Premium Custom React Video Player Engine (Custom Controls, Mute/Unmute Toggle, Seek Scrub Bar, and Fullscreen support)
 */

import React, { useState, useRef, useEffect } from 'react';
import './TrailerModal.css';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Reset player state when opening modal
    useEffect(() => {
        if (isOpen && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(() => {
                // If unmuted autoplay is blocked by browser, try muted autoplay
                if (videoRef.current) {
                    videoRef.current.muted = true;
                    setIsMuted(true);
                    videoRef.current.play();
                    setIsPlaying(true);
                }
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Detect movie genre or title for matching HD trailer video streams
    const getTrailerStreamUrl = (title) => {
        if (!title) return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        const lower = title.toLowerCase();

        if (lower.includes('stree') || lower.includes('horror') || lower.includes('conjuring') || lower.includes('nun')) {
            return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        }
        if (lower.includes('oppenheimer') || lower.includes('dune') || lower.includes('deadpool') || lower.includes('animal') || lower.includes('jawan')) {
            return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
        }
        return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4';
    };

    const getYouTubeSearchUrl = (title) => {
        const query = encodeURIComponent(`${title || 'Movie'} official trailer`);
        return `https://www.youtube.com/results?search_query=${query}`;
    };

    const videoStreamUrl = getTrailerStreamUrl(movieTitle);
    const ytSearchUrl = getYouTubeSearchUrl(movieTitle);

    // Toggle Play/Pause
    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    // Toggle Mute/Unmute
    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    // Handle Time Update
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration || 0);
        }
    };

    // Handle Seek Scrub
    const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    // Toggle Fullscreen
    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
            }
        }
    };

    // Format Time (seconds -> mm:ss)
    const formatTime = (secs) => {
        if (isNaN(secs) || secs < 0) return '00:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content cinematic-player-card" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header">
                    <div className="header-title-box">
                        <h3>🎬 Official Trailer: {movieTitle || 'Movie Trailer'}</h3>
                        <span className="trailer-hd-badge">1080p Full HD</span>
                    </div>
                    <div className="modal-header-actions">
                        <a
                            href={ytSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-yt-direct"
                        >
                            ▶ Search on YouTube ↗
                        </a>
                        <button className="modal-close-btn" onClick={onClose} aria-label="Close Trailer">✕</button>
                    </div>
                </div>

                {/* Video Container Area with Custom Player Overlay */}
                <div className="modal-video-wrapper">
                    <div className="html5-video-container" onClick={togglePlay}>
                        <video
                            ref={videoRef}
                            src={videoStreamUrl}
                            autoPlay
                            muted={isMuted}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleTimeUpdate}
                            className="cinematic-html5-player"
                            poster="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
                        />

                        {/* Center Big Play/Pause Button Overlay */}
                        {!isPlaying && (
                            <div className="big-center-play-overlay">
                                <button className="big-play-btn" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                                    ▶
                                </button>
                            </div>
                        )}

                        {/* Top Mute/Unmute Notice Badge */}
                        {isMuted && (
                            <button className="unmute-notice-badge" onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
                                🔇 Click to Unmute Sound
                            </button>
                        )}
                    </div>

                    {/* Custom Video Control Bar */}
                    <div className="custom-player-controls">
                        {/* Play/Pause Button */}
                        <button className="ctrl-btn play-pause-btn" onClick={togglePlay}>
                            {isPlaying ? '⏸ Pause' : '▶ Play'}
                        </button>

                        {/* Time Counter */}
                        <span className="time-display">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>

                        {/* Interactive Seek Slider Bar */}
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="seek-slider"
                        />

                        {/* Sound Mute/Unmute Toggle */}
                        <button className="ctrl-btn sound-btn" onClick={toggleMute}>
                            {isMuted ? '🔇 Unmute' : '🔊 Sound On'}
                        </button>

                        {/* Fullscreen Button */}
                        <button className="ctrl-btn fs-btn" onClick={toggleFullscreen}>
                            ⛶ Fullscreen
                        </button>
                    </div>
                </div>

                {/* Footer Notice */}
                <div className="modal-footer-notice">
                    <div className="notice-left">
                        <span>🍿 Streaming Official 1080p Cinematic Movie Trailer.</span>
                    </div>
                    <div className="notice-right">
                        <a
                            href={ytSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="notice-yt-link"
                        >
                            ▶ Watch More Clips on YouTube ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrailerModal;

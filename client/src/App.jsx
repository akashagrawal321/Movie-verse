/**
 * @file App.jsx
 * @description Main Application Layout Component
 */

import React from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AppRoutes from './routes/AppRoutes';
import CinematicIntro from './components/CinematicIntro';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <CinematicIntro />
            <Navbar />
            <main className="main-content">
                <AppRoutes />
            </main>
            <Footer />
        </div>
    );
}

export default App;

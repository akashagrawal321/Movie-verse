/**
 * @file AppRoutes.jsx
 * @description Central React Router v6 Route Declarations for MovieVerse Pro
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from '../pages/HomePage';
import MoviesPage from '../pages/MoviesPage';
import MovieDetailsPage from '../pages/MovieDetailsPage';
import ShowSelectionPage from '../pages/ShowSelectionPage';
import SeatBookingPage from '../pages/SeatBookingPage';
import BookingSuccessPage from '../pages/BookingSuccessPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// Protected User Pages
import ProfilePage from '../pages/ProfilePage';
import MyBookingsPage from '../pages/MyBookingsPage';
import WishlistPage from '../pages/WishlistPage';

// Protected Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminMoviesPage from '../pages/admin/AdminMoviesPage';
import AdminShowsPage from '../pages/admin/AdminShowsPage';

// Route Guards
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/shows/:movieId" element={<ShowSelectionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected User Routes */}
            <Route
                path="/booking/:showId"
                element={
                    <ProtectedRoute>
                        <SeatBookingPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/booking-success/:bookingId"
                element={
                    <ProtectedRoute>
                        <BookingSuccessPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-bookings"
                element={
                    <ProtectedRoute>
                        <MyBookingsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/wishlist"
                element={
                    <ProtectedRoute>
                        <WishlistPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            {/* Protected Admin Routes */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/movies"
                element={
                    <AdminRoute>
                        <AdminMoviesPage />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/shows"
                element={
                    <AdminRoute>
                        <AdminShowsPage />
                    </AdminRoute>
                }
            />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;

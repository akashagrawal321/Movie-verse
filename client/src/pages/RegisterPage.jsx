/**
 * @file RegisterPage.jsx
 * @description User Registration Page Component
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Controlled Components: Form input state managed using React useState hook.
 * 2. Client-Side Validation: Ensures matching passwords and minimum 6-character length before sending network request.
 * 3. Context Integration: Consumes `register` function from `AuthContext` to update global auth state.
 */

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './RegisterPage.css';

const RegisterPage = () => {
    // Controlled form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // 1. Client-Side Password Confirmation Check
        if (formData.password !== formData.confirmPassword) {
            return setErrorMsg('Passwords do not match. Please verify and try again.');
        }

        // 2. Password Length Check
        if (formData.password.length < 6) {
            return setErrorMsg('Password must be at least 6 characters long.');
        }

        setIsSubmitting(true);

        // 3. Dispatch Register Request via AuthContext
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });

        setIsSubmitting(false);

        if (result.success) {
            // Redirect to home page upon successful registration
            navigate('/');
        } else {
            setErrorMsg(result.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join MovieVerse to book tickets online instantly</p>

                {errorMsg && <div className="auth-error">⚠️ {errorMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g. Alex Morgan"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="e.g. alex@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            minLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

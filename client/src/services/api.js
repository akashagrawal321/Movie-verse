/**
 * @file api.js
 * @description Frontend API Service Layer for Axios HTTP Requests
 * 
 * INTERVIEW CONCEPTS COVERED:
 * 1. Axios Interceptor Pattern:
 *    Automatically attaches `Authorization: Bearer <token>` to all HTTP requests.
 * 2. Service Layer Abstraction:
 *    Encapsulates backend URL endpoint configuration cleanly inside services directory.
 */

import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Attach JWT token from localStorage
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 Unauthorized token expirations
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default API;

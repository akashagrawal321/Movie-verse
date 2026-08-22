/**
 * @file axios.js
 * @description Centralized Axios Instance with JWT Interceptor
 * 
 * Beginner Explanation:
 * Axios allows creating custom instances with predefined base URLs and default headers.
 * Interceptors run before every request. This interceptor checks if a JWT token exists
 * in browser localStorage and automatically attaches it to the request Authorization header.
 */

import axios from 'axios';

// Create custom Axios instance pointing to backend API server
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Request Interceptor: Automatically attach JWT Bearer token if present in localStorage
 */
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('movieverse_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor: Global response handling (e.g. 401 Unauthorized handling)
 */
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid - clear localStorage token if present
            localStorage.removeItem('movieverse_token');
        }
        return Promise.reject(error);
    }
);

export default API;

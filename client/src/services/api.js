/**
 * @file api.js
 * @description Frontend API Service Layer for Axios HTTP Requests
 */

import axios from 'axios';

// Get API base URL from env vars or fallback to production Render backend URL
const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
    if (envUrl) {
        return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    }
    return 'https://movie-verse-ac9k.onrender.com/api';
};

const API = axios.create({
    baseURL: getBaseURL(),
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

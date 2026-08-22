/**
 * @file axios.js
 * @description Centralized Axios Instance with JWT Interceptor
 */

import axios from 'axios';

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

// Request Interceptor: Attach token from localStorage
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || localStorage.getItem('movieverse_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global 401 response handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('movieverse_token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default API;

// frontend/src/utils/api.js

import axios from "axios";
import { getToken } from "./auth"; // 🆕 ADDED: Centralized JWT access

/**
 * Centralized Axios instance
 * --------------------------
 * WHY:
 * - Avoid repeating base URLs, and headers across the app
 * - Makes authentication, logging and error handling global
 */

const api = axios.create({
    baseURL: "https://127.0.0.1:5000/api", // 🔄 UPDATED: Single source of API truth
});

/**
 * Request Interceptor
 * -------------------
 * WHY:
 * - Automatically attaches JWT to every outgoing request
 * - Keeps auth logic out of components and API calls
 * - Ensures protected endpoints always recieve credentials
 */

api.interceptors.request.use(
    (config) => {
        const token = getToken(); // 🔐 Fetch token from auth utility
        
        if (token){
            // 🆕 ADDED: Attach Authorization header only if token exists
            config.headers.Authorization = `Bearer $(token)`;
        }
        return config;
    },
    (error) => {
        // Forward request errors (network/config issues)
        return Promise.reject(error);
    }
);

export default api;
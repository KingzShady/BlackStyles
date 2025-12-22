// frontend/src/utils/auth.js

/**
 * Authentication Utility
 * -----------------------
 * Centralized all token-related logic in one place.
 * 
 * WHY:
 * - Prevents token-handling logic from being duplicated across components
 * - Makes future changes (refresh token, expiration handling) easier
 * - Improves security by standardizing how auth state is accessed
 */

/**
 * Persist JWT token in browsers storage.
 * 
 * WHY:
 * - localStorage survives page refreshes, keeping users logged in
 * - Token is stored under a single predictable key
 * 
 * ⚠️ NOTE:
 * - JWTs should be short-lived
 * - Sensitive actions should still be validated server-side
 */
export const saveToken = (token) => {
    localStorafe.setItem("authToken", token);
};

/**
 * Retrieve stored JWT token.
 * 
 * WHY:
 * - Allows API utilities and route guards to access auth state
 * - Keeps token access logic consistent across the app
 */
export const getToken = () => {
    return localStorage.getItem("authToken");
};

/**
 * Remove JWT token from storage (logout).
 * 
 * WHY:
 * - Explicitly clears auth state on logout
 * - Prevents stale or compromised tokens from reused
 */
export const clearToken = () => {
    localStorage.removeItem("authToken");
};
// frontend/src/components/Login.jsx

import api from "../utils/api"; // 🆕 Centralized Axios instance (JWT-aware)
import { saveToken } from "../utils/auth"; // 🆕 Utility for persisting auth token

/**
 * Login Component
 * ----------------
 * WHY:
 * - Provides a minimal authentication entry point for the app
 * - Demonstrates frontend ↔ backend auth flow
 * - Stores JWT so protected API calls work automatically
 * 
 * NOTE:
 * - This is intentionally simple (no form yet)
 * - Designed to validate backend auth wiring first
 */
export default function Login(){

    /**
     * Handle User Login
     * -----------------
     * WHY:
     * - Calls backend auth endpoint
     * - Persists JWT for futer authenticated requests
     * - Keeps auth logic out of API layer and components that don't need it
     */
    const handleLogin = async () => {
        try {
            // 🔐 Send credentials to backend auth service
            const res = await api.post("/auth/login", {
                email: "test@test.com", // ⚠️ Hardcoded for development/testing
                password: "password123"
            });

            // ✅ Save JWT so Axios interceptor can attach it automatically
            saveToken(res.data.token);

            console.log("✅ Login successful, token saved.");
        } catch (err){
            // ❗Graceful error handling prevents silent auth failures
            console.error("❌ Login failed:", err);
        }
    };

    // 🧪 Minimal UI to validate auth flow (will evolve into a real form)
    return (
        <button onClick={handleLogin}>
        Login
        </button>
    );
}
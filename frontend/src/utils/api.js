// frontend/src/utils/api.js

import axios from "axios";

// Define the base URL for your backend API
const API_BASE = "http://localhost:5000";

// ✅ Base URL for the backend API requests
// Using the localhost during development; update when deployed

/**
 * ✅ Save a palette entry to the backend persistence layer.
 *  - Sends image URL, extracted colors, and matched theme.
 *  - Returns the saved entry (with timestamp).
 */

export const savePalette = async (imageUrl, colours, theme) => {
    const res = await axios.post(`${API_BASE}/api/palettes/save`, {
        imageUrl,
        colours,
        theme,
    });
    return res.data;
};

/**
 * ✅ Fetch the most recent palettes from backend.
 * - Default: retrieves last 5 palettes.
 * - Returns a list of saved Palettes.
 */

export const getRecentPalettes = async (limit = 5) => {
    const res = await axios.get(`${API_BASE}/api/palettes/recent?limit=${limit}`);
    return res.data.palettes;
};
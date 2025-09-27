// frontend/src/utils/api.js

import axios from "axios";

// ✅ Updated: use consistent API base with '/api' prefix
const API_BASE = "http://localhost:5000/api";

/**
 * Save an outfit entry to the backend persistence layer.
 * - Why: Palettes evolve into "outfits" with theme + colours + image.
 * - Returns saved outfit object with timestamp.
 */

export async function saveOutfit(imageUrl, colours, theme){
    const res = await axios.post(`${API_BASE}/outfits/save`, {
        imageUrl,
        colours,
        theme,
    });
    return res.data;
}

/**
 * Fetch recently saved outfits from backend.
 * - Why: Users need persistence across sessions/devices.
 * - Default: retrieves last 5 outfits.
 */
export async function fetchOutfits(limit = 5){
    const res = await axios.get(`${API_BASE}/outfits/recent?limit=${limit}`);
    return res.data;
}
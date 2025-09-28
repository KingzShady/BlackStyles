// frontend/src/utils/api.js

import axios from "axios";

// ✅ Consistent API base with '/api' prefix
const API_BASE = "http://localhost:5000/api";

/**
 * Save an outfit entry to the backend persistence layer.
 * - Why: Outfits now support optional user-provided captions for richer context.
 * - Arguments:
 *  - image_url: URL of the uploaded outfit image
 *  - colours: extracted colour palette (list of hex values)
 *  - theme: detected theme (e.g., "casual", "formal")
 *  - caption: (optional) short text description provided by user
 * - Returns saved outfit object with timestamp + caption.
 */

export async function saveOutfit(imageUrl, colours, theme, caption = ""){
    const res = await axios.post(`${API_BASE}/outfits/save`, {
        image_url: imageUrl,
        colours,
        theme,
        caption, // ✅ NEW: caption now included in payload
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
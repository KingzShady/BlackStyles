// frontend/src/utils/api.js

import axios from "axios";

// ✅ Consistent API base with '/api' prefix
const API_BASE = "http://localhost:5000/api";

/**
 * Save an outfit entry to the backend persistence layer.
 * - Why: Outfits now support optional user-provided captions for richer context.
 */

export async function saveOutfit(imageUrl, colours, theme, caption = "", tags = []){
    const res = await axios.post(`${API_BASE}/outfits/save`, {
        image_url: imageUrl,
        colours,
        theme,
        caption, 
        tags, // ✅ Includes optional tags for persistence
    });
    return res.data;
}

/**
 * Fetch recently saved outfits from backend.
 * - Why: Users need persistence across sessions/devices.
 */
export async function fetchOutfits(limit = 5){
    const res = await axios.get(`${API_BASE}/outfits/recent?limit=${limit}`);
    return res.data;
}

/**
 * Search outfits by mutiple tags and optional theme.
 * - Why: Adds more powerful filtering by combining tags and themes.
 * - Example: searchOutfits(["summer", "casual"], "streetwear")
 */
export async function searchOutfits(tags = [], theme = ""){
    // ✅ Backend expects tags as a comma-separated string and theme as plain string
    // ✅ Using axios `params` safely encodes query strings to avoid injection issues
    const res = await axios.get(`${API_BASE}/outfits/search`, { 
        params: { 
            tags: tags.join(","), // Join array into a single string
            theme // Optional theme filter
        }, 
    });

    // ✅ Return only the outfits array to keep UI consumption simple
    return res.data.outfits;
};
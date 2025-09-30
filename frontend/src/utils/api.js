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
 * Search outfits by tags.
 * - Why: Allows users to filter outfits dynamically by category.
 * - Example: searchOutfitsByTag("summer")
 */
export async function searchOutfitsByTag(tag){
    // ✅ Using `params` ensures safe query string handling
    const res = await axios.get(`${API_BASE}/outfits/search`, { params: { tag } });
    return res.data.outfits; // Only return the outfits array for cleaner usage
}
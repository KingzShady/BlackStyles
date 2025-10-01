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
 * Search outfits by mutiple tags.
 * - Why: Enablrd advanced filtering so users can refine results (e.g., "summer, casual").
 * - Example: searchOutfitsByTag(["summer", "casual"])
 */
export async function searchOutfitsByTag(tags){
    // ✅ Backend expects tags as a comma-separated string (e.g., "summer,casual")
    // ✅ Using axios `params` safely encodes query strings to avoid injection issues
    const res = await axios.get(`${API_BASE}/outfits/search`, { 
        params: { tags: tags.join(",") }, // Join array into a single string
    });

    // ✅ Return only the outfits array to keep UI consumption simple
    return res.data.outfits;
};
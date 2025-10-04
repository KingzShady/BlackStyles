// frontend/src/utils/api.js

import axios from "axios";

// ✅ Consistent API base with '/api' prefix
const API_BASE = "http://localhost:5000/api";

/**
 * Save an outfit entry to the backend persistence layer.
 */
export async function saveOutfit(imageUrl, colours, theme, caption = "", tags = []){
    const res = await axios.post(`${API_BASE}/outfits/save`, {
        image_url: imageUrl,
        colours,
        theme,
        caption, 
        tags,
    });
    return res.data;
}

/**
 * Fetch recently saved outfits from backend.
 */
export async function fetchOutfits(limit = 5){
    const res = await axios.get(`${API_BASE}/outfits/recent?limit=${limit}`);
    return res.data;
}

/**
 * 🔄 Updated: Search outfits by tags, theme, and sort order.
 * - Why: Adds more sorting control to enhance search usability (newest, oldest, alphabetical).
 * - Example: searchOutfits(["streetwear"], "urban", "newest")
 */
export async function searchOutfits(tags = [], theme = "", sort = ""){
    // ✅ ADDED: `sort` param to allow backend sorting of search results
    const res = await axios.get(`${API_BASE}/outfits/search`, { 
        params: { 
            tags: tags.join(","), // Convert array into comma-separated string
            theme, // Optional theme filter
            sort, // 🆕 NEW: sort parameter for ordering results
        }, 
    });

    // ✅ Keeps return consistent for frontend rendering
    return res.data.outfits;
};
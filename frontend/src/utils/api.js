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
 * @param {number} limit - The Number of outfits to return.
 */
export async function fetchOutfits(limit = 5){
    const res = await axios.get(`${API_BASE}/outfits/recent?limit=${limit}`);
    return res.data;
}

/**
 * 🔄 Updated: Search outfits by tags, theme, sort order and page number.
 * - Example: searchOutfits(["streetwear"], "urban", "newest", 2)
 */
export async function searchOutfits(tags = [], theme = "", sort = "", page = 1, limit = 10){
    // ✅ Ensure page is passed correctly, default limit is 10
    const res = await axios.get(`${API_BASE}/outfits/search`, { 
        params: { 
            tags: tags.join(","),
            theme,
            sort,
            page,
            limit
        }, 
    });
    return res.data.outfits;
};
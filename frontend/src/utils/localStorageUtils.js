// frontend/src/utils/localStorageUtils.js
// ✅ Added persistence utilities for filters & sorting preferences

const STORAGE_KEY = "black_styles_outfits"; // Existing storage key for saved outfits

// ------------------------------------------
// 🆕 NEW SECTION: Filter & Sort Persistence
// ------------------------------------------

/**
 * Save user's selected filters and sorting options to localStorage.
 * Why: Allows the app to remember the user's filter/sporting preferences
 * even after a page reload or session restart.
 */
export const saveFilters = (filters) => {
    try {
        // Use a distinct key to avoid overwriting saved outfits
        localStorage.setItem("blackstyles-filters", JSON.stringify(filters));
    } catch (e) {
        console.error("Failed to save filters:", e);
    }
};

/**
 * Load user's filters and sort settings from localStorage.
 * If not found, returns default structure with empty values.
 * Why: Keeps UI consistent with user's last used settings.
 */
export const loadFilters = () => {
    try{
        const data = localStorage.getItem("blackstyles-filters");
        return data ? JSON.parse(data) : { tags: [], theme: "", sort: "" };
    } catch (e){
        console.error("Failed to load filters:", e);
        return { tags: [], theme: "", sort: "" };
    }
};


// -----------------------------------------
// 🧩 Existing outfit save utilities
// -----------------------------------------
export function getSavedOutfits() {
try{
    const raw = localStorage.getItem(STORAGE_KEY); 
    return raw ? JSON.parse(raw) : [];
} catch (e){
    console.error("localStorage read error:", e);
    return [];
  }
}

export function saveOutfit(outfit){
    const arr = getSavedOutfits();
    arr.unshift(outfit);
    if (arr.length > 20) arr.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}


export function deleteOutfit(id) {
    const arr = getSavedOutfits().filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export function clearSavedOutfits() {
    localStorage.removeItem(STORAGE_KEY);
}

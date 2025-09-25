// frontend/src/utils/localStorageUtils.js
// Small helper to manage saved outfits in localStorage

const STORAGE_KEY = "black_styles_outfits"; // Unque key to avoid clashes with other apps in the browser


// Get saved outfits array (or empty array if nothing is stored)
export function getSavedOutfits() {
try{
    const raw = localStorage.getItem(STORAGE_KEY); 
    return raw ? JSON.parse(raw) : [];
} catch (e){
    console.error("localStorage read error:", e); // Log error without crashing app
    return [];
  }
}

/**
 * Save outfits to localStorage.
 * - Newest outfits are placed at the start of the array.
 * - Caps stored outfits at 20 to avoid unbounded growth.
 * Outfits shape: {id, imageData, palette, theme, savedAt}
 */
export function saveOutfit(outfit){
    const arr = getSavedOutfits();
    arr.unshift(outfit); // Add new outfit to the start
    if (arr.length > 20) arr.pop(); // Keep size capped at 20
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); // Save back to localStorage
}

/**
 * Delete a single outfit by unique ID.
 */
export function deleteOutfit(id) {
    const arr = getSavedOutfits().filter((o) => o.id !== id); // Filter out the outfit with the given ID
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); // Save the updated array back to localStorage
}

/**
 * Delete all saved outfits.
 */
export function clearSavedOutfits() {
    localStorage.removeItem(STORAGE_KEY); // Remove the entire key
}

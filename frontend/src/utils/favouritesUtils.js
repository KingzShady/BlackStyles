// frontend/src/utils/favouritesUtils.js
// Utilites to manage favourite outfits in localStorage

const FAVOURITES_KEY = 'blackstyles-favourites';

/**
 * Get the current list of favourite outfit IDs from localStorage.
 * Returns an array of outfit IDs.
 */
export function getFavourites() {
    try {
        const raw = localStorage.getItem(FAVOURITES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Failed to load favourites:", e);
        return [];
    }
}

/**
 * Toggle a given outfit ID in the favourites.
 * If it's already a favourite, remove it; otherwise, add it.
 * Returns the new state (true if now favourite, false if removed).
 */
export function toggleFavourite(outfitId) {
    const favourites = getFavourites();
    const index = favourites.indexOf(outfitId);
    let isNowFavourite = false;

    if (index > -1) {
        // ✅ Remove from favourites
        favourites.splice(index, 1);
        isNowFavourite = false;
    } else {
        // ✅ Add to favourites
        favourites.push(outfitId);
        isNowFavourite = true;
    }

    try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
    } catch (e) {
        console.error("Failed to save favourites:", e);
    }

    return isNowFavourite;
}
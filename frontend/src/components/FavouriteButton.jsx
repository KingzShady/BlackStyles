// frontend/src/components/FavouriteButton.jsx
import { useState } from "react";
import { toggleFavourite, getFavourites } from "../utils/favouritesUtils";

/**
 * FavouriteButton component displays a toggleable favourite button for each outfit.
 * Props:
 * * - outfitId: string | number - The unique identifier for the outfit.
 */
export default function FavouriteButton({ outfitId }) {
    // Initialize state based on whether this outfit is already a favourite
    const [isFav, setIsFav] = useState(getFavourites().includes(outfitId));

    const handleClick = () => {
        const newState = toggleFavourite(outfitId);
        setIsFav(newState); // Update local button state
    };

    return (
        <button
            onClick={handleClick}
            className={`px-2 py-1 rounded ${isFav ? "bg-red-500 text-white" : "bg-gray-200"}`}
        >
            {isFav ? "★ Favourite" : "☆ Add to Favourites"}
        </button>
    );
}
// frontend/src/components/OutfitCard.jsx
import React from "react";
import ColourSwatches from "./ColourSwatches";

const OutfitCard = ({ outfit }) => {
    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px"}}>
            <img
                src={outfit.image_url}
                alt="Outfit"
                style={{ width: "100px", borderRadius: "4px" }}
            />

            {/* ✅ NEW: Only render caption if it exists to avoid empty lines */}
            {outfit.caption && <p><em>{outfit.caption}</em></p>}

            <p>Theme: {outfit.theme}</p>
            <ColourSwatches colours={outfit.colours} />
        </div>
    );
};

export default OutfitCard;
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

            {/* Render caption if it exists */}
            {outfit.caption && <p><em>{outfit.caption}</em></p>}

            <p>Theme: {outfit.theme}</p>

            {/*✅ NEW: Display tags if any exist */}
            {outfit.tags && outfit.tags.length > 0 && (
                <p className="tags">
                    {outfit.tags.map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                    ))}
                </p>
            )}

            <ColourSwatches colours={outfit.colours} />
        </div>
    );
};

export default OutfitCard;
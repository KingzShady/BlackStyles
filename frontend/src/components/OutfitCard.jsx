// frontend/src/components/OutfitCard.jsx
import React from "react";
import ColourSwatches from "./ColourSwatches";

const OutfitCard = ({ outfit }) => {
    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px"}}>
            <img
                src={outfit.imageUrl}
                alt="Outfit"
                style={{ width: "100px", borderRadius: "4px" }}
            />
            <p>Theme: {outfit.theme}</p>
            <ColourSwatches colours={outfit.colours} />
        </div>
    );
};

export default OutfitCard;
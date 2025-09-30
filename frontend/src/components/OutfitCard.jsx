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

            {outfit.caption && <p><em>{outfit.caption}</em></p>}

            <p>Theme: {outfit.theme}</p>

            {/* 🔹 Refined tag styling using Tailwind-like classes */}
            {outfit.tags && outfit.tags.length > 0 && (
                <p className="tags">
                    {outfit.tags.map((tag, i) => (
                        <span 
                            key={i} 
                            className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                            style={{ 
                                marginRight: '6px',
                                border: '1px solid #ccc',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                display: 'inline-block',
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </p>
            )}

            <ColourSwatches colours={outfit.colours} />
        </div>
    );
};

export default OutfitCard;
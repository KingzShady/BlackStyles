// frontend/src/components/OutfitCard.jsx
import React from "react";
import ColourSwatches from "./ColourSwatches";

// Helper function to capitalize the first letter for CSS class matching
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const OutfitCard = ({ outfit }) => {
    return (
        <div 
            style={{ 
                border: "1px solid white", 
                padding: "15px", 
                margin: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <img
                src={outfit.image_url}
                alt="Outfit"
                style={{ 
                    width: "150px",
                    height: "150px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    marginBottom: "10px",

                }}
            />

            {outfit.caption && <p><em>{outfit.caption}</em></p>}

            <p style={{ fontWeight: 'bold' }}>Theme: {outfit.theme}</p>

            {/* 🔹 Refined tag styling using Tailwind-like classes */}
            {outfit.tags && outfit.tags.length > 0 && (
                <p lassName="tags" style={{ minHeight: '30px' }}>
                    {outfit.tags.map((tag, i) => {
                        const tagClassName = capitalize(tag);
                        return (
                            <span
                                key={i}
                                className={`tag-badge ${tagClassName}`}
                            >
                                {tag}
                            </span>
                        );
                    })}
                </p>
            )}

            <ColourSwatches colours={outfit.colours} />
        </div>
    );
};
export default OutfitCard;
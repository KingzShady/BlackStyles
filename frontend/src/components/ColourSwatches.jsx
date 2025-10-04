//frontend/src/components/ColourSwatches.jsx
import React, {useState} from 'react';

const ColourSwatches = ({ colours }) => {
    const [copiedHex, setCopiedHex] = useState(null); // Track which hex was last copied

    // Copy hex to clipboard and show temporary feedback
    const copyToClipboard = (hex) => {
        navigator.clipboard.writeText(hex);
        setCopiedHex(hex); // Highlight copied swatch
        setTimeout(() => setCopiedHex(null), 1500); // Reset after 1.5 seconds
    };

    if (!colours || colours.length === 0) return null; // Guard clause

    return (
        <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
            {colours.map((hex, index) => (
                <div key={index} style={{ textAlign: "center"}}>
                    {/* Swatch box clickable for copying*/}
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: hex,
                            border: "1px solid white",
                            borderRadius: "4px",
                            cursor: "pointer", // Indicate clickable
                        }}
                        onClick={() => copyToClipboard(hex)}
                        title="Click to copy"
                    />
                    {/* Hex code display */}
                    <div style={{ marginTop: 4, fontSize: 12, fontFamily: "monospace"}}>{hex}</div>
                    {/* ✅ Show "Copied!" feedback temporarily */}
                    {copiedHex === hex && <div style={{ color: "green", fontSize: 12}}>Copied!</div>}
                </div>
            ))}
        </div>
    );
};

export default ColourSwatches;
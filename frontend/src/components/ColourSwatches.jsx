// React is the core library for building UI components
import React, {useState} from 'react';

/*
  Simplified ColourSwatches Component
  -----------------------------------
  - Props: `colours` (array of hex strings e.g. ['#aabbcc', '#ff0000'])
  - Displays each swatch as a coloured box with its hex code below.
  - Includes a Copy button to copy hex values to clipboard.
  - Simplified design: smaller swatches, minimal styling, and uses a direct alert for feedback.
*/

const ColourSwatches = ({ colours }) => {
    // Handle copying colour hex code to clipboard
    const copyToClipboard = (hex) => {
        navigator.clipboard.writeText(hex); // Modern API support only
        alert(`Copied ${hex} to clipboard!`); // Quick feedback
    };

    // Guard: render nothing if colours array is empty
    if (!colours || colours.length === 0) return null;

    return (
        <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
            {colours.map((hex, index) => (
                <div key={index} style={{ textAlign: "center"}}>
                    {/* Swatch box */}
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: hex,
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                    {/* Hex code text */}
                    <div style={{ marginTop: 4, fontSize: 12, fontFamily: "monospace"}}>
                        {hex}
                    </div>
                    {/* Copy button */}
                    <button
                        onClick={() => copyToClipboard(hex)}
                        style={{
                            marginTop: 4,
                            fontSize: 12,
                            padding: "2px 6px",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                    >
                        Copy
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ColourSwatches;
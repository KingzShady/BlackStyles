// React is the core library for building UI components
import e from 'express';
import React from 'react';

// Define a reusable style object for each colour box (swatch)
const swatchStyle = {
    display: "inline-block", // Allows boxes to appear side by side.
    width: 50,               // Swatch width in pixels.
    height: 50,              // Swatch height in pixels.
    borderRadius: 6,         // Slight rounding of corners.
    marginRight: 8,          // Space between swatches.
    border: "1px solid #ccc",// Light border for contrast.
    position: "relative",    // Can be extended for tooltips or overlays.
};

/**
 * ColourSwatches Component
 *  @param {Array} colours - Array of Hex codes (e.g., ['#FF5733', '#33FF57'])
 * Displays top 3-5 colour swatches with their corresponding hex codes.
 */
export default function ColourSwatches({ colours = [] }) {
    // If no colours are provided, render nothing
    if(!colours.length) return null;

    return (
        <div style={{ marginTop: 16}}>
            <div style={{ display: "flex", alignItems: "center", gap: 12}}>
                {colours.map((hex, idx) => (
                    <div key={idx} style={{ textAlign: "center" }}>
                        {/* Visual colour box */}
                        <div
                            aria-label={hex}
                            style={{ ...swatchStyle, backgroundColor: hex }}
                        />
                        {/* Hex code below the swatch */}]
                        <div style={{marginTop: 4, fontSize: 12, fontFamily: "monospace"}}>
                            {hex}
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
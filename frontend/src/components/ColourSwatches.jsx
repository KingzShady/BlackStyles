// React is the core library for building UI components
import React, {useState} from 'react';

/*
  ColourSwatches Component
  -----------------------
  - Input: `colours` (array of hex strings e.g. ['#aabbcc', '#ff0000'])
  - Displays swatches with hex code below
  - Each swatch has a "Copy" button that copies the hex code to clipboard
  - Shows "Copied ✓" feedback briefly after copying
*/

// Define a reusable style object for eaach colour box (swatch)
const swatchStyle = {
    display: "inline-block", // Allows boxes to appear side by side.
    width: 56,               // Swatch width in pixels. made it slightly bigger than before for better tap/click accuracy
    height: 56,              // Swatch height in pixels.
    borderRadius: 6,         // Slight rounding of corners.
    marginRight: 12,          // Space between swatches.
    border: "1px solid rgba(0,0,0,0.08)",// Light border for contrast. // subtle border for contrast
};

/**
 * ColourSwatches Component
 *  @param {Array} colours - Array of Hex codes (e.g., ['#FF5733', '#33FF57'])
 * Displays top 3-5 colour swatches with their corresponding hex codes.
 */
export default function ColourSwatches({ colours = [] }) {
  // Keep track of which swatch was last copied (by index)
  const [copiedIndex, setCopiedIndex] = useState(null);

   /**
   * Copies hex value to clipboard.
   * Uses modern Clipboard API, with fallback for older browsers.
   */
   const handleCopy = async (hex, index) => { // Copy hex code to clipboard
    try {
        if (navigator.clipboard?.writeText){ // Check for modern clipboard API support
            // Modern browsers
            await navigator.clipboard.writeText(hex);
        } 
        
        else {
            // Fallback for Legacy browsers
            const textArea = document.createElement("textarea"); // Create a temporary textarea
            textArea.value = hex; // Set its value to the hex code
            document.body.appendChild(textArea); // Append to body
            textArea.select(); // Select the text
            document.execCommand("copy"); // Execute copy command
            textArea.remove(); // Clean up
        }
        setCopiedIndex(index); // Mark this index as copied
        // Reset after 1s so user sees quick feedback
        setTimeout(() => setCopiedIndex(null), 1000);
    } catch (e) {
        console.error("Failed to copy!", e);
    }
   };

    // If no colours are provided, render nothing
    if(!colours || colours.length === 0) return null;

    return (
        <div style={{ marginTop: 12}}>
            <div style={{ 
                display: "flex", 
                alignItems: "flex-start", 
                gap: 12, 
                flexWrap: "wrap", // Responsive Wrap for smaller screens
            }} 
            >
                {colours.map((hex, idx) => (
                    <div key={hex + idx} style={{ textAlign: "center" }}>
                        {/* Visual colour box */}
                        <div
                            role="img"
                            aria-label={`Color ${hex}`}
                            style={{ ...swatchStyle, backgroundColor: hex }}
                        />
                        {/* Hex code below the swatch */}
                        <div style={{marginTop: 6, fontSize: 12, fontFamily: "monospace"}}>
                            {hex}
                        </div>

                        {/* Copy button with feedback */}
                        <button
                            onClick={() => handleCopy(hex, idx)}
                            style={{
                                marginTop: 6, // Space above button
                                padding: "4px 8px", // Small padding for button
                                fontSize: 12, // Smaller text
                                borderRadius: 6, // Rounded corners
                                border: "1px solid rgba(0,0,0,0.8)", // Light border
                                background: "#fff", // White background
                                cursor: "pointer", // Pointer cursor on hover
                            }}
                            >
                            {copiedIndex === idx ? "Copied ✓" : "Copy"}
                            </button>
                    </div>
                ))}
            </div>
        </div>

    );
}
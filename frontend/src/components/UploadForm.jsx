// frontend/src/components/UploadForm.jsx
import React, { useState } from "react";
import { saveOutfit } from "../utils/api";
import ColourSwatches from "./ColourSwatches";
import axios from "axios";
import RecentOutfits from "./RecentOutfits"; 

const UploadForm = () => {
  // UI state flags
  const [loading, setLoading] = useState(false); // Track upload state
  const [error, setError] = useState(null); // Error feedback for user
  const [palette, setPalette] = useState([]); // Colours extracted from backend
  const [caption, setCaption] = useState(""); // Store optional caption text
  const [tags, setTags] = useState(""); // Store raw tags input

  // Handle form submit: upload image, extract palette, persist to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.elements.fileInput.files[0];
    if (!file) return; // ✅ prevent crashes if user clicks submit with no file

    setLoading(true);
    setError(null);

    try {
      // Actual image upload and palette extraction logic
      const formData = new FormData();
      formData.append("image", file); // Key "image" must match what backend expects

      // Send image to backend for processing
      const response = await axios.post("http://localhost:5000/api/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend returns { "palette": ["#hex1", "#hex2", ...] }
      if(!response.data || !response.data.palette) {
        throw new Error("Invalid response from server: Missing palette data");
      }

      const extractedPalette = response.data.palette;
      setPalette(extractedPalette); // Use the data from the API response

      // Assign placeholder theme (will later come from backend theme matcher)
      const theme = "Autumn";

      // Persist outfit with caption + parsed tags
      const payload = {
        image_url: URL.createObjectURL(file),
        colours: extractedPalette,
        theme,
        caption,
        tags: tags.split(",").map((t) => t.trim()).filter((t) => t) // ✅ parse comma-separated
      }

      await saveOutfit(
        payload.image_url,
        payload.colours,
        payload.theme,
        payload.caption,
        payload.tags
      );
      
    } catch (err){
      console.error("Upload error:", err); // Keep: Log the error for debugging
      // Check for API error message if available
      const errMsg = err.response?.data?.error || "Upload failed. Please try again.";
      setError(errMsg); // ✅ clear error message for UX
    } finally {
      setLoading(false); // Always stop spinner
    }
  };
  
  return (
    <div style={{
      padding: '20px',
        margin: '20px 0',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        // Note: Using a general background/color style to respect the light/dark mode setup in index.css
    }}>
       <h2 style={{ marginBottom: '15px' }}>Upload New Outfit</h2>

    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* File input for selecting an outfit image */}
      <input 
        type="file" 
        name="fileInput" 
        accept="image/*" 
        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      />

      {/* Caption input */}
      <input
        type="text"
        placeholder="Add a caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
      />

      {/* input field for tags */}
      <label>Tags (comma-seperated):</label>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="e.g., Formal, Streetwear"
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
      />

      {/* Submit button */}
      <button 
        type="submit" 
        disabled={loading}
        style={{
          padding: '10px 15px',
          // Mimicking the blue accent color from the Search button in RecentOutfits.jsx
          backgroundColor: loading ? '#5b89cf' : '#4a90e2', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'default' : 'pointer',
          transition: 'background-color 0.3s',
          fontWeight: 'bold'
        }}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Show upload state */}
      {loading && <p>loading...</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Show extracted palette if available */}
      {palette.length > 0 && <ColourSwatches colours={palette} />}
    </form>
    </div>
  );
};

export default UploadForm;
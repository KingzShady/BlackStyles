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
      // 👇 IMPROVE: Check for API error message if available
      const errMsg = err.response?.data?.error || "Upload failed. Please try again.";
      setError(errMsg); // ✅ clear error message for UX
    } finally {
      setLoading(false); // Always stop spinner
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded shadow-lg" style={{ maxWidth: '400px' }}>
      
      <h3>Upload New Outfit</h3>

      {/* File input for selecting an outfit image */}
      <div className="flex flex-col">
        <label htmlFor="file-input" style={{ marginBottom: '4px' }}>Image File:</label>
        <input type="file" id="file-input" name="fileInput" accept="image/*" />
      </div>

      {/* Caption input */}
      <div className="flex flex-col">
        <label htmlFor="caption-input" style={{ marginBottom: '4px' }}>Caption (optional):</label>
        <input
        id="caption-input"
        type="text"
        placeholder="Add a caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      

      {/* Input field for tags */}
      <div className="flex flex-col">
        <label htmlFor="tags-input" style={{ marginBottom: '4px' }}>Tags (comma-seperated):</label> {/* ✅ Added label for clarity */}
        <input
          id="tags-input"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., Formal, Streetwear"
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      {/* Show extracted palette if available */}
      {palette.length > 0 && 
        <div style={{ marginTop: '8px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Detected Palette:</p>
          <ColourSwatches colours={palette} />
        </div>
      }

      {/* Submit button */}
      <button 
        type="submit" 
        disabled={loading}
        style={{ marginTop: '16px', backgroundColor: '#646cff', color: 'white', fontWeight: 'bold' }}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Show upload state */}
      {loading && <p>Processing upload...</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}
    </form>
  );
};

export default UploadForm;
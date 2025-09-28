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
  const [caption, setCaption] = useState(""); // ✅ NEW: store optional caption text

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

      // ✅ UPDATED: Persist outfit with caption as well
      await saveOutfit(URL.createObjectURL(file), extractedPalette, theme, caption);
      
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
    <form onSubmit={handleSubmit}>
      {/* File input for selecting an outfit image */}
      <input type="file" name="fileInput" accept="image/*" />

      {/* ✅ NEW: input field to allow users to add caption for the outfit*/}
      <input
        type="text"
        placeholder="Add a caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      {/* Submit button, disabled while loading */}
      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Show upload state */}
      {loading && <p>loading...</p>}
      {error && <p style={{ color: 'red'}}>{error}</p>}

      {/* Show extracted palette if available */}
      {palette.length > 0 && <ColourSwatches colours={palette} />}
    </form>
  );
};

export default UploadForm;
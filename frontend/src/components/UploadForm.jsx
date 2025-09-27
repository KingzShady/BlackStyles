// frontend/src/components/UploadForm.jsx
import React, { useState } from "react";
import { saveOutfit } from "../utils/api"; // ✅ New: persistence layer for outfits
import ColourSwatches from "./ColourSwatches";

const UploadForm = () => {
  // UI state flags
  const [loading, setLoading] = useState(false); // Track upload state
  const [error, setError] = useState(null); // Error feedback for user
  const [palette, setPalette] = useState([]); // Colours extracted from backend

  // Handle form submit: upload image, extract palette, persist to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.elements.fileInput.files[0];
    if (!file) return; // ✅ prevent crashes if user clicks submit with no file

    setLoading(true);
    setError(null);

    try {
      // ✅ Temporary mock data until backend pallete extraction is fully integrated
      const data = { colours: ["#1A1A1A", "#FFFFFF", "#D4AF37"] };
      setPalette(data.colours);

      // ✅ Assign placeholder theme (will later come from backend theme matcher)
      const theme = "Autumn";

      // ✅ Save outfit (image + palette + theme) to backend persistence API
      await saveOutfit(URL.createObjectURL(file), data.colours, theme);
      
    } catch (err){
      console.error("Upload error:", err);
      setError("Upload failed. Please try again."); // ✅ clear error message for UX
    } finally {
      setLoading(false); // Always stop spinner
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* File input for selecting an outfit image */}
      <input type="file" name="fileInput" accept="image/*" />
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
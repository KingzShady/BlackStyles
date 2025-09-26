// frontend/src/components/UploadForm.jsx
import React, { useState } from "react";
import { savePalette } from "../utils/api"; // ✅ unified backend persistence
import ColourSwatches from "./ColourSwatches";


/* 
UploadForm Component (refactored)
- Simplified: delegates palette extraction logic to helper
- Directly saves palettes + theme to backend persistence layer
- Cleaner UI: removed localStorage + "RecentOutfits"
*/

const UploadForm = () => {
  // UI state flags and messages
  const [loading, setLoading] = useState(false); // Track upload state
  const [error, setError] = useState(null); // Error feedback for user
  const [palette, setPalette] = useState([]); // Colours extracted from backend

  // Handle form submit: upload image, extract palette, persist to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.elements.fileInput.files[0];
    if (!file) return; // ✅ prevent crashes if no file chosen

    // Reset state
    setLoading(true);
    setError(null);

    try {
      // 🔹 Placeholder: integrate backend API for palette extraction
      const data = await extractPaletteFromFile(file);
      setPalette(data.colours);

      // For now, assign static theme (TODO: replace with backend theme service)
      const theme = "Summer";

      // ✅ Save to backend persistence (instead of localStorage)
      await savePalette(URL.createObjectURL(file), data.colours, theme);
      
    } catch (err){
      console.error("Upload error:", err);
      setError("Failed to process image. Please try again."); // ✅ better UX
    } finally {
      setLoading(false); // Always end loading spinner
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* File input for selecting an outfit image*/}
      <input type="file" name="fileInput" accept="image/*" />
      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* User Feedback states */}
      {loading && <p>loading...</p>}
      {error && <p style={{ color: 'red'}}>{error}</p>}

      {/* Show palette if successfully extracted */}
      {palette.length > 0 && <ColourSwatches colours={palette} />}
    </form>
  );
};

export default UploadForm;
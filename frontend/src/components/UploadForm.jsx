import React, { useState } from "react";
import axios from "axios";
import ColourSwatches from "./ColourSwatches";
import RecentOutfits from "./RecentOutfits";
import { saveOutfit } from "../utils/localStorageUtils";

/* 
UploadForm Component
- Handles file selection and preview (base64)
- Upload image to backend to extract a colour palette
- Allows saving a composed "outfit" (preview + palette) to localStorage
- Provides loading, error and saved feedback states
*/

export default function UploadForm() {
  // File chosen by the user (File object)
  const [file, setFile] = useState(null);

  // Local preview of the selected image (data URL) for quick user feedback
  const [previewDataUrl, setPreviewDataUrl] = useState(null);

  // Store the palette returned by backend
  const [palette, setPalette] = useState([]);

  // Optional semantic label returned by backend (e.g. "Warm Neutrals")
  const [ theme, setTheme ] = useState("");

  // UI state flags and messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  // Read file and generate a base64 preview for display & storage
  const handleFileChange = (e) => {
    setSavedMsg(""); // Clear any previous saved message
    setPalette([]); // Clear previous palette
    setTheme(""); // Clear previous theme
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      setPreviewDataUrl(null);
      return;
    }
    setFile(f); // Store the File object

    // FileReader lets me show a preview without sending to backend
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewDataUrl(ev.target.result); // Base64 string
    };
    reader.readAsDataURL(f); // Trigger the read
  };

  // Upload selected file to backend, get palette, then request theme label
  const handleUpload = async () => {
    setError("");      // Clear any previous errors
    setPalette([]);    // Reset palette
    setTheme("");      // Reset theme
    setSavedMsg("");   // Clear saved message

    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    setLoading(true);  // Show loader
    const formData = new FormData(); // Create form data
    formData.append("image", file); // Append selected file

    try {
      // Make POST request to Flask backend
      const res = await axios.post("http://localhost:5000/api/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 20000, // Set timeout to handle stuck connections
      });

      if (!res.data || !res.data.palette) {
        throw new Error("Unexpected response from server");
      }

      // Keep the top 3–5 colors (backend returns 5)
      const gotPalette = res.data.palette.slice(0, 5);
      setPalette(gotPalette);

      // Optional: ask backend to return human-friendly theme label
      try {
        const t = await axios.post("http://localhost:5000/api/image/theme", { palette: gotPalette });
        if (t.data && t.data.theme) setTheme(t.data.theme);
      } catch (themeErr) {
        // Non-critical, continue if theme service fails
        console.warn("Theme request failed:", themeErr);
      }
    } catch (err) {
      console.error("Upload failed:", err);

      // Show the most helpful error message avaliable
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.code === "ECONNABORTED") {
        setError("Upload timed out. Please try again.");
      } else {
        setError("Upload failed. Please check the console for details.");
      }
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Save the current preview + palette + theme to localStorage for later browsing
  const handleSaveOutfit = () => {
    if(!previewDataUrl || palette.length){
      setError("Cannot save — no preview or palette found.");
      return;
    }

    const outfit = {
      id: Date.now(), // Unique ID based on timestamp
      image: previewDataUrl,
      palette,
      theme,
      savedAt: new Date().toISOString(),
    };
    saveOutfit(outfit);
    setSavedMsg("Saved! See Recently Saved Outfits below.");

  return (
    <div style={{ maxWidth: 680 }}>
      <h2>Upload an Image</h2>

      {/* Image input field aka File picker */}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {/* Controls row: upload button + preview thumbnail + loading indicator */}
      <div style={{ marginTop: 10,  display: "flex", gap: 12, alignContents: "center" }}>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>

      {/* Small preview so User can confirm the selected image */}
      {previewDataUrl && (
        <div style={{ border: "1px solid #eee", padding: 6, borderRadius: 6}}>
          <img
            src={previewDataUrl}
            alt="preview"
          style={{ height: 96, width: 96, objectFit: "cover" }}
          />
        </div>
      )}

        {loading && <div aria-label="loading">⏳</div>}
      </div>

      {/* Show error feedback box (user-visible) */}
      {error && (
        <div style={{ marginTop: 12, padding: 8, background: "#ffe6e6", borderRadius: 6, color: "#800"}}>
          {error}
        </div>
      )}

      {/* Show extracted palette + theme and allow saving the outfit */}
      {palette.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>Extracted Palette {theme && `- ${theme}`}</h3>

          {/* Visual swatches (top 3-5 colors)*/}
          <ColourSwatches colours={palette} />

          {/* Save outfit button action */}
          < div style={{marginTop:12}}>
          <button onClick={handleSaveOutfit}>💾 Save Outfit</button>
          {savedMsg && <span style={{marginLeft: 12, color: "green"}}>{savedMsg}</span>}
          </div>
        </div>
      )}
      
      {/* List of recently saved outfits from localStorage */}
      <RecentOutfits />
    </div>
  );
};

}
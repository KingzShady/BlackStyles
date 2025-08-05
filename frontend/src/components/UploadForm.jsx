import React, { useState } from "react";
import axios from "axios";
import ColorSwatches from "./ColorSwatches";

function UploadForm() {
  // Store the selected file from input
  const [file, setFile] = useState(null);

  // Store the palette returned by backend
  const [palette, setPalette] = useState([]);

  // Track upload state (true = uploading)
  const [loading, setLoading] = useState(false);

  // Store any error message to display to user
  const [error, setError] = useState("");

  // Handle image upload and extract color palette
  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    setError("");      // Clear any previous errors
    setLoading(true);  // Show loader
    setPalette([]);    // Reset palette

    const formData = new FormData();
    formData.append("image", file); // Append selected file

    try {
      // Make POST request to Flask backend
      const res = await axios.post("http://localhost:5000/api/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 15000, // Set timeout to handle stuck connections
      });

      // If palette is returned, slice top 3–5 colors
      if (res.data && res.data.palette) {
        setPalette(res.data.palette.slice(0, 5));
      } else {
        setError("Unexpected response format.");
      }
    } catch (err) {
      console.error("Upload failed:", err);

      // Provide specific error messages where possible
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === "ECONNABORTED") {
        setError("Request timed out.");
      } else {
        setError("Upload failed. Check console for details.");
      }
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div style={{ maxWidth: 480, padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>Upload an Image</h2>

      {/* Image input field */}
      <div style={{ marginBottom: 8 }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]); // Store file
            setError("");               // Clear previous error
          }}
        />
      </div>

      {/* Upload button with loading state */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={handleUpload} disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        {loading && <div aria-label="loading" style={{ marginLeft: 8 }}>⏳</div>}
      </div>

      {/* Show error message box if needed */}
      {error && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            backgroundColor: "#ffe6e6",
            border: "1px solid #ff4d4f",
            borderRadius: 4,
            color: "#800000",
          }}
        >
          {error}
        </div>
      )}

      {/* Display extracted color swatches */}
      {palette.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>Extracted Palette</h3>
          <ColorSwatches colors={palette} />
        </div>
      )}
    </div>
  );
}

export default UploadForm;

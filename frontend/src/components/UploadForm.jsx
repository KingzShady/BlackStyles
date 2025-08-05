import React, { useState } from "react";
import axios from "axios";
import ColourSwatches from "./ColourSwatches";

const UploadForm = () =>{

    // State to store the selected file from the input
    const [file, setFile] = useState(null);

    // State to store palette returned by backend
    const [palette, setPalette] = useState([]);

    // Track upload state (true = uploading)
    const [loading, setLoading] = useState(false);

    // Store any error message to display to user
    const [error, setError] = useState("");

    // Handle the upload logic when user clicks the Upload button
    const handleUpload = async () => {
        if (!file) {
            setError("Please select an image file to upload.");
            return;
        }

        setError(""); // Clear any error messages
        setLoading(true); // Show loader
        setPalette([]); // Reset palette

        const formData = new FormData(); // Creating a new FormData object to send the file
        formData.append("image", file); // Append the file to the from data with the key 'image'

        // Check if a file is selected
        try {
            // Send POST request to backend endpoint with the image file
            const res = await axios.post("http://localhost:5000/api/image/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 15000, // Set timeout to handle stuck connections                
            });

            // If palette is returned, slice top 5 colors
            if (res.data && res.data.palette) {
                setPalette(res.data.palette.slice(0, 5));
            } else {
                setError("Unexpected response format.");
            }

            // Display the extracted color palette in HEX format from server response
            console.log("Extracted palette", res.data.palette);
        } catch (e) {
            // Log an error if uploads fails (network/server/validation issues)
            console.error("Uploading failed:", e);

            // Provide specific error messages where possible
            if (e.response?.data?.error){
                setError(e.response.data.error);
            } else if (e.code === 'ECONNABORTED') {
                setError("Request timed out.");
            } else{
                setError("Upload failed. Check console for details.");
            }
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <div style={{ maxWidth: 480, padding: 16}}>
        <h2 style={{ marginBottom: 8}}>Upload an Image</h2>
        
        {/* File input field - allows users to chose an image */}
        <div style={{ marginBottom: 8 }}>
            
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    setFile(e.target.files[0]); // Store file
                    setError(""); // Clear previous error
                }}
            />
        </div>
            {/* Upload button with loading state */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={handleUpload} disabled={loading} style={{ padding: "8px 16px"}}>
                {loading ? "Uploading..." : "Upload"}
            </button>
            {loading && <div aria-label="loading" style={{ marginLeft: 8}}>⏳</div>}
        </div>

        {/* Display any error messages if needed*/}
        {error && (
            <div
                style={{
                    marginTop: 12,
                    padding: 10,
                    backgroundColor: "#ffe6e",
                    border: "1px solid #ff4d4f",
                    borderRadius: 4,
                    color: "#800000"
                }}
            >
                {error}
            </div>
        )}

        {/* Display the extracted colour swatches */}
        {palette.length > 0 && (
            <div style={{ marginTop: 16 }}>
                <h3>Extracted Palette</h3>
                <ColourSwatches colours={palette} />
            </div>
        )}
        </div>
    );

}

export default UploadForm;
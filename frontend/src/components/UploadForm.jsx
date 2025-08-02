import React, { useState } from "react";
import axios from "axios";

const UploadForm = () =>{

    // State to store the selected file from the input
    const [file, setFile] = useState(null);

    // Handle the upload logic when user clicks the Upload button
    const handleUpload = async () => {
        const formData = new FormData(); // Creating a new FormData object to send the file
        formData.append("image", file); // Append the file to the from data with the key 'image'

        // Make a Post Request to the backend with image file
        const res = await axios.post("http://localhost:5000/api/image/upload", formData);

        // Log color palette (or other results) returned from the server
        console.log("Palette", res.data);
    };

    return (
        <div>
            {/* File input field - allows users to chose an image */}
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
            />

            {/* Button to trigger the upload */}
            <button onClick={handleUpload}>Upload</button>
        </div>
    );

}

export default UploadForm;
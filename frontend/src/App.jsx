// src/App.jsx
import React from "react";
import UploadForm from "./components/UploadForm";

function App() {
  return (
    // Appied base styling to give the app a clean, modern look
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24}}>
      
      {/* App title */}
      <h1>Black Styles</h1>

      {/* Upload form is still being rendered */}
      <UploadForm />
    </div>
  );
}
export default App;
// frontend/src/App.jsx
import React from "react";
import UploadForm from "./components/UploadForm";
import RecentOutfits from "./components/RecentOutfits"; // ✅ Added new component import

/**
 * App
 * - Root component that ties together all major features
 * - Why: Keeps the app simple and declarative by listing top-level UI sections
 */

function App() {
  return (
    // ✅ Clean container, base styling can be centralized later in CSS
    <div 
      style={{ 
        fontFamily: "system-ui, sans-serif", 
        padding: 24,
        maxWidth: '1200px',
        margin: '0 auto'  // Center the app horizontally
      }
      }>
      
      {/* App title */}
      <h1>Black Styles</h1>

      {/* Upload form is still being rendered */}
      <UploadForm />

      {/* ✅ New: RecentOutfits shows outfits saved in backend persistence*/}
      <RecentOutfits />
    </div>
  );
}
export default App;
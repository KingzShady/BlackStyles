# 📆 Daily Dev Log — Black Styles

*A React + Flask AI fashion app for culturally rich and body-aware style recommendations.*

---

## 🗓️ Day 1

### ✅ What I Implemented Today

- Initialized full project folder structure with `frontend/` and `backend/`
- Created `UploadForm.jsx` React component with file input and Axios POST call
- Set up `App.jsx` to render the upload component
- Scaffolded Flask backend with `create_app()` factory pattern
- Enabled CORS to allow frontend-backend communication
- Ran both dev servers successfully (`npm run dev`, `python run.py`)

---

### 🧪 What I Tested

- ✅ React dev server loads and displays upload UI
- ✅ Axios POST triggers on upload button click
- ✅ Flask server runs without crashing
- ❌ Backend doesn’t respond to Axios yet (upload route not created)

---

### 🧠 Any Issues or Bugs Encountered

- ❌ **UploadForm.jsx** wasn’t rendering initially  
  ✅ Fixed by importing it properly in `App.jsx`

- 🟡 Awaiting Flask `/api/image/upload` route for full Axios test  
  🧠 Backend logic to handle `multipart/form-data` will need `request.files`

---

### 💬 Git Commits Made (Conventional Format)


chore: initialize project structure with frontend and backend folders
feat(frontend): set up React with Vite and basic UploadForm component
fix(frontend): render UploadForm component in App.jsx
feat(backend): initialize Flask app with create_app factory and enable CORS

---

## 🗓️ Day 2

### ✅ What I Implemented Today

- Created `/api/image/upload` POST route in Flask to receive clothing image
- Used `tempfile` to save and process uploaded image safely
- Wrote KMeans color palette extractor using OpenCV and NumPy
- Returned top 5 hex colors from image back to frontend
- Connected frontend Axios call to backend and logged results to browser console

---

### 🧪 What I Tested

- ✅ POST request from `UploadForm` with real image file
- ✅ Flask correctly receives and saves image
- ✅ Color palette extraction works reliably across test images
- ✅ Axios receives hex code array response
- ❌ Palette currently only visible in browser console

---

### 🧠 Any Issues or Bugs Encountered

- 🔸 Initially forgot to convert BGR to RGB → returned odd hex colors  
  ✅ Fixed with color conversion logic

- 🔸 Test failed when image file missing → added error handling and `400` response

- 🔸 No UI feedback for success/fail  
  🟡 Still pending: visual output + error boundary

---

### 💬 Git Commits Made (Conventional Format)

```bash
feat(backend): add image upload route to handle image file POSTs
feat(backend): implement color palette extraction logic with OpenCV and KMeans
feat(frontend): connect UploadForm to image upload endpoint and log palette response

---

## 🗓️ Day 3

### ✅ What I Implemented Today

- Created `/api/image/upload` Flask POST route  
- Added file type restrictions to allow only image MIME types for uploads  
- Implemented basic request logging middleware for the upload route  
- Auto-cropped image to center 200x200 pixels before color palette extraction  
- Handled corrupted image input or invalid processing gracefully with clean error messages  

---

### 🧪 What I Tested

- ✅ Uploaded valid `.jpg` and `.png` files via frontend form, successfully processed  
- ✅ Returned 3–5 hex colors extracted from cropped images  
- ✅ Uploaded non-image files and broken uploads returned proper 400 errors  
- ✅ Auto-cropping preserved the image center and passed correctly to KMeans algorithm  
- ✅ Console logs confirmed request tracking and error logging worked as expected  

---

### 🧠 Any Issues or Bugs Encountered

- ❌ Initial test with non-image files crashed the server  
  ✅ Fixed by adding try/except error handling  
- ❌ Pillow library misread some images uploaded from certain Android phones  
  ✅ Added validation fallback to handle these cases  
- ❌ Auto-cropping was initially hardcoded with the wrong size  
  ✅ Fixed with dynamic center cropping logic  

---

### 💬 Git Commits Made (Conventional Format)

```bash
feat(backend): add CORS and upload POST route with file validation
feat(backend): restrict file types to images only for uploads
chore(backend): add request logging to upload route
feat(backend): auto-crop center of image before color extraction
fix(backend): handle image read/processing failure gracefully

---

# Black Styles — Day 4 Frontend Development Summary

## Features Implemented
- Added `ColorSwatches` component to render extracted color palette visually.
- Integrated palette into `UploadForm`, showing top 3–5 hex colors with swatches.
- Implemented loading state to indicate upload in progress.
- Added error UI for failed uploads or missing files.

## Stack
- Frontend: React (Vite)
- Communication: Axios POST to Flask backend
- Visualization: Dynamic swatches with hex labels

## Testing
- Verified swatches appear with correct hex values after successful upload.
- Loading indicator displays during request.
- Error messages surface with meaningful backend feedback.

## Branch
- `feat/day4-palette-ui-frontend`

## Next Goals
- Clipboard copy for hex codes.
- Persistent recent palettes.
- Styling polish (Tailwind integration).

---

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

```bash
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


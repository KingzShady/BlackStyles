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

## 📆 Day 5 — Testing Log

### Tests performed
- **End-to-end upload → palette → theme**
  - Sent image via frontend upload; backend returned palette; `/api/theme` returned theme label. ✅
- **Copy-to-clipboard**
  - Clicked Copy under swatches; clipboard contains hex codes. ✅
- **Save Outfit**
  - Saved outfit (preview base64 + palette + theme) to localStorage under `black_styles_outfits`. ✅
  - RecentOutfits displays saved items across reloads. ✅
- **Error handling**
  - Renamed `.txt` to `.jpg` caused backend rejection; frontend shows backend message; server did not crash. ✅
- **Manual theme endpoint test**
  - Postman: `POST /api/theme` → returned theme for sample palette. ✅

### Issues found
- If backend not running, frontend times out — handled and shows error message.
- Theme mapping is simple and will be refined.

---

## ✅ Day 5 — Daily Dev Log

**What I implemented today**
- Added copy-to-clipboard in `ColorSwatches.jsx`.
- Implemented Save Outfit feature (preview + palette + theme) and localStorage utilities (`localStorageUtils.js`).
- Created `RecentOutfits.jsx` component to show saved outfit thumbnails and palettes.
- Added lightweight backend theme matching (`theme_matcher.py`) and route `/api/theme`.

**What I tested**
- Frontend upload and palette extraction.
- Copying hex to clipboard.
- Saving outfits and viewing recent items across reloads.
- Backend `/api/theme` via Postman and frontend.

**Issues / notes**
- Theme matcher is deterministic and basic — fine for Day 5 scaffolding.
- Consider server-side persistence (MongoDB) next.

**Git commits (examples)**
- ✨ feat(utils): Add localStorage utility for managing saved outfits with limit & safety checks
- Add copy-to-clipboard feature to ColourSwatches
- Update prop and component naming to 'ColourSwatches'
- refactor(utils): fix saveOutfit & clearSavedOutfits
- feat(RecentOutfits): display saved outfits with palette, theme & delete
- feat: add image preview, theme lookup, save outfit & recent outfits UI
- feat: add lightweight hex palette → seasonal theme matcher
- feat: add POST /api/theme route for palette → theme matching

---

## 📆 Daily Dev Log — Black Styles (Day 6)

### ✅ What I Implemented Today

- [x] Backend persistence for color palettes (`palette_service.py`)
- [x] New Flask routes `/api/palettes/save` and `/api/palettes/recent` (`palettes.py`)
- [x] Frontend API utilities (`api.js`) for saving and fetching palettes
- [x] Updated `UploadForm.jsx` to save generated palettes
- [x] Modified `RecentOutfits.jsx` to fetch from backend instead of localStorage
- [x] Display theme (season) for each palette (via `ThemeTag.jsx`)

---

### 🧪 What I Tested

- [x] Backend API endpoints with curl/Postman  
- [x] Upload a photo → palette is generated and saved  
- [x] `RecentOutfits` fetches latest palettes from backend  
- [x] Edge cases: missing fields, empty recent list

---

### 🧠 Any Issues or Bugs Encountered

- None major; file-based persistence works as fallback if MongoDB unavailable  
- No frontend crashes; proper error handling displayed in console/log

---

### 💬 Git Commits Made (Conventional Format)


feat(backend+frontend): add palette persistence and recent outfits UI


## 📆 Daily Dev Log — Black Styles (Day 7)

A React + Flask AI fashion app for culturally rich and body-aware style recommendations.

---

### ✅ What I Implemented Today
- Added **frontend UI for palette visualization**:
  - Color swatches display with hex values.
  - Loading indicator during file uploads.
  - Error message handling for failed uploads.
- Integrated backend response with new frontend display logic.

---

### 🧪 What I Tested
- **Frontend**: 
  - Valid uploads → palette swatches + hex display working.
  - Invalid uploads → error messages show.
  - Loading state correctly triggers and clears.
- **Backend**:
  - Still returns expected color arrays.
- Edge cases tested:
  - Non-image uploads rejected.
  - Large images processed.
  - Error state properly displayed.

---

### 🧠 Any Issues or Bugs Encountered
- Initial issue with loading spinner not hiding → fixed by setting `setLoading(false)` in both success + error cases.
- Hex values overlapped with swatches until CSS adjusted.

---

### 💬 Git Commits Made (Conventional Format)


feat(frontend): add color swatches component with hex display
feat(frontend): implement loading indicator during uploads
feat(frontend): add error handling UI for failed uploads
fix(frontend): ensure loading spinner hides on error
style(frontend): adjust CSS for swatch layout and hex labels

---

## 📆 Daily Dev Log — Black Styles (Day 8)

A React + Flask AI fashion app for culturally rich and body-aware style recommendations.

---

### ✅ What I Implemented Today
- **Backend**
  - Added `outfit_service.py` for saving/fetching outfits in `outfits.json`
  - Created `outfits.py` routes:
    - `POST /api/outfits/save`
    - `GET /api/outfits/recent`
- **Frontend**
  - Extended `UploadForm.jsx` to save outfit after upload
  - Added `OutfitCard.jsx` for displaying outfit image + swatches + theme
  - Updated `RecentOutfits.jsx` to fetch outfits from backend
  - Expanded `api.js` with `saveOutfit` and `fetchOutfits`

---

### 🧪 What I Tested
- Backend API routes via curl & Postman
- Valid uploads → Outfits persisted & visible in RecentOutfits
- Invalid uploads → Error messages handled
- Persistence verified via `outfits.json`

---

### 🧠 Issues or Bugs
- No critical issues; integration worked smoothly
- Minor tweak: ensured `theme` defaults safely if missing

---

### 💬 Git Commits (Conventional Format)

feat(backend): add outfit service with JSON persistence
feat(backend): create outfits routes for save + recent
feat(frontend): extend UploadForm to save outfits
feat(frontend): add OutfitCard component for displaying outfits
feat(frontend): update RecentOutfits to fetch from backend
feat(frontend): expand api.js with saveOutfit + fetchOutfits

---

## 📆 Daily Dev Log — Black Styles (Day 9)

A React + Flask AI fashion app for culturally rich and body-aware style recommendations.

---

### ✅ What I Implemented Today
- Added `caption` field to outfit uploads in backend (`outfits.py`, `outfit_service.py`).
- Updated frontend `UploadForm.jsx` to include caption input.
- Updated `OutfitCard.jsx` to display captions.
- Improved copy-to-clipboard UX in `ColourSwatches.jsx`.

---

### 🧪 What I Tested
- Backend outfit save with/without caption.
- Recent outfits API includes captions.
- Upload form correctly sends caption.
- Outfit cards display caption text.
- Clipboard copy feedback works with tooltips.

---

### 🧠 Any Issues or Bugs Encountered
- Early bug: caption defaulted to `null` instead of `""` → fixed in backend service.
- Clipboard UX initially relied on `alert()` → replaced with tooltip text.

---

### 💬 Git Commits Made (Conventional Format)

feat(backend): add caption support to outfits API
feat(frontend): add caption input to UploadForm
feat(frontend): display captions in OutfitCard
fix(frontend): replace alert() with tooltip for copy-to-clipboard

### Black Styles — Day 9
**Focus:** UX Improvements (Captions + Clipboard Feedback)

- Implemented captions for outfits:
  - Users can add custom captions when uploading.
  - Captions stored in backend and displayed in Recent Outfits.
- Improved copy-to-clipboard:
  - Replaced intrusive alert popups with inline tooltip confirmation.
- Technologies: React, Flask, Axios, JSON persistence.

---

## 📆 Daily Dev Log — Black Styles (Day 10)

A React + Flask AI fashion app for culturally rich and body-aware style recommendations.

---

### ✅ What I Implemented Today
- Added `tags` field to backend outfit API (save + fetch).
- Extended persistence (`outfits.json`) with tags support.
- Updated `UploadForm.jsx` to allow comma-separated tags.
- Updated `OutfitCard.jsx` to display tags visually.

---

### 🧪 What I Tested
- Backend save and fetch with tags.
- Upload form correctly parses tags.
- Outfit cards render tags as styled labels.
- Persistence across refresh confirmed.

---

### 🧠 Any Issues or Bugs Encountered
- [ ] Any parsing errors with tags?
- [ ] Styling quirks in OutfitCard?
- [ ] Edge case: empty tags input → saved as `[]`.

---

### 💬 Git Commits Made (Conventional Format)

feat(backend): add tags support to outfits API
feat(backend): persist tags in outfits.json
feat(frontend): add tags input to UploadForm
feat(frontend): render tags in OutfitCard

### Black Styles — Day 10
**Focus:** Outfit Tagging & Categorization

- Extended outfit model with **tags** (Formal, Streetwear, Workwear, etc.).
- Tags added via frontend form, persisted in backend JSON.
- Outfits now display tags as styled badges under captions.
- Enables future **filtering & search** by tags.

---

## 📆 Daily Dev Log — Black Styles (Day 11)

A React + Flask AI fashion app for culturally rich and body-aware style recommendations.

---

### ✅ What I Implemented Today
- Added new backend route: `GET /api/outfits/search?tag=<tag>`.
- Implemented tag-based filtering in backend service.
- Added search bar to `RecentOutfits.jsx`.
- Refined `OutfitCard.jsx` with styled tag badges.

---

### 🧪 What I Tested
- Backend outfit search by tag (case-insensitive).
- Frontend search bar functionality.
- Tag badge styling across multiple outfits.
- Edge cases: empty search, non-matching tag.

---

### 🧠 Any Issues or Bugs Encountered
- [ ] Search input didn’t clear results until refresh (fixed by fallback logic).
- [ ] Tag badge styling alignment needed minor CSS tweaks.

---

### 💬 Git Commits Made (Conventional Format)

feat(backend): add search route for outfits by tag
feat(backend): implement search_outfits_by_tag service
feat(frontend): add search bar to RecentOutfits
style(frontend): refine tag badges in OutfitCard

### Black Styles — Day 11
**Focus:** Outfit Filtering by Tags

- Added **tag-based search** for outfits.
- Backend supports `GET /api/outfits/search?tag=<tag>`.
- Frontend includes a search bar to filter outfits dynamically.
- Tags styled as modern pill badges for readability.
- Enables scalable categorization (Formal, Casual, Streetwear, etc.).

---
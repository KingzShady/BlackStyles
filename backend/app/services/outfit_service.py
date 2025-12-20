# backend/app/services/outfit_service.py
from .mongo_service import get_collection
import json, os
from datetime import datetime

DATA_FILE = os.path.join(os.path.dirname(__file__), "../../data/outfits.json")

# =========================
# Outfit CRUD Operations
# =========================

def get_outfits(page=1, limit=10):
    """
    Retrieve outfits from MongoDB if available; otherwise fallback to JSON file.
    Pagination ensures efficient data fetching using MongoDB.
    """
    collection = get_collection("outfits")
    if collection:
        skip = (page - 1) * limit
        return list(collection.find().skip(skip).limit(limit))
    
    with open(DATA_FILE, "r") as f:
        outfits = json.load(f)
    start = (page - 1) * limit
    return outfits[start:start + limit]

def save_outfit(image_url, colours, theme, caption="", tags=None):
    """
    Persist a new outfit.
    Designed to work in both production (MongoDB) and local/dev environments (JSON).
    """
    tags = tags or []

    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "image_url": image_url,
        "colours": colours,
        "theme": theme,
        "caption": caption,
        "tags": tags
    }

    collection = get_collection("outfits")
    if collection:
        collection.insert_one(entry)
        return entry
    
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            json.dump([], f)

    with open(DATA_FILE, "r+") as f:
        outfits = json.load(f)
        outfits.insert(0, entry)
        f.seek(0)
        json.dump(outfits, f, indent=2)

    return entry

# =========================
# ⭐ Favorites (JWT-Scoped)
# =========================

def save_favorite(user_id, outfit_id):
    """
    Save an outfit to the authenticated user's favorites.

    WHY:
    - `user_id` must come from a verified JWT, ensuring users can only
      modify their own favorites.
    - `$addToSet` prevents duplicate favorites without extra logic.
    """
    collection = get_collection("favorites")

    # 🆕 ADDED: JWT-scoped favorites persistence
    collection.update_one(
        { "user_id": user_id },                 # 🔐 Scope data authenticated user
        { "$addToSet": {"outfits": outfit_id}}, # ✅ Prevent duplicates automatically
        upsert=True                             # 🧠 Create doc if user favourite don't exist yet
    )

def get_favorites(user_id):
    """
    Retrieve all favorite outfits IDs for the authenticated user.

    WHY:
    - Keeps favorites isolated per user (JWT identity boundary).
    - Return a predictable empty list when no favorites exist.
    """
    collection = get_collection("favorites")
    doc = collection.find_one({ "user_id": user_id })

    # 🆕 ADDED: Safe Fallback to empty list
    return doc["outfits"] if doc else []
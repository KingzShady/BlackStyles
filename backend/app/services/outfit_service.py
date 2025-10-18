# backend/app/services/outfit_service.py
from .mongo_service import get_collection # ✅ ADDED: Import MongoDB helper
import json, os
from datetime import datetime

# ✅ CHANGE: Updated JSON file path for fallback persistence
DATA_FILE = os.path.join(os.path.dirname(__file__), "../../data/outfits.json")

def get_outfits(page=1, limit=10):
    """
    Retrieve outfits from MongoDB if available; otherwise fallback to JSON file.
    Pagination ensures efficient data fetching using MongoDB.
    """
    collection = get_collection("outfits")
    if collection:
        # ✅ ADDED: MongoDB pagination support for scalable retrieval
        skip = (page - 1) * limit
        return list(collection.find().skip(skip).limit(limit))
    
    # ⚙️ FALLBACK: Read local JSON File when MongoDB is unavailable
    with open(DATA_FILE, "r") as f:
        outfits = json.load(f)
    start = (page - 1) * limit
    end = start + limit
    return outfits[start:end]

def save_outfit(image_url, colours, theme, caption="", tags=None):
    """
    Retreve the outfits from MonngoDB if available; otherwise fallback to JSON file.
    This hybrid approach provides reliability across enviroments.
    """
    if tags is None:
        tags = [] # ✅ Ensure tags list exist (avoid NoneType issues)

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
        # ✅ ADDED: MongoDB persistence support
        collection.insert_one(entry)
        print("✅ Outfit saved to MongoDB.")
    else:
        # ⚙️ Fallback to JSON for local/dev environments
        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, "w") as f:
                json.dump([], f)
        with open(DATA_FILE, "r+") as f:
            outfits = json.load(f)
            outfits.insert(0, entry)
            f.seek(0)
            json.dump(outfits, f, indent=2)
        print("⚠️ MongoDB unavailable – saved to JSON fallback")
    
    return entry
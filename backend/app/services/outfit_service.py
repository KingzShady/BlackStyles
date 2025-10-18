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

def _load_outfits():
    """Load all outfits from JSON; safe fallback to [] if file missing or corrupted."""
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []
    
def _save_outfits(outfits):
    """Persist outfits back to JSON file with indentation for readablity."""
    with open(DATA_FILE, "w") as f:
        json.dump(outfits, f, indent=2)

# ✅ UPDATED: Added optional `tags` parameter (default empty string)
def _save_outfit(image_url, colours, theme, caption="", tags=None):
    """
    Save a new outfit entry
    Args:
     image_url (str): Url of the outfit image
     colours (list[str]): extracted  colour palette (hex codes)
     theme (str): detected outfit theme
     caption (str, optional): user-provided description
     tags (list[str], optional): user-provided tags for categorization
    Returns:
        dict: persisted outfit entry
    """
    if tags is None:
        tags = [] # ✅ Ensure tags is always a list (avoid NoneType issues)

    outfits = _load_outfits()

    entry = {
        "timestamp": datetime.utcnow().isoformat(), # track when saved
        "image_url": image_url,
        "colours": colours,
        "theme": theme,
        "caption": caption,
        "tags": tags # ✅ tags now persisted
    }

    outfits.insert(0, entry)  # ✅ Keep newest outfits at the top
    _save_outfits(outfits)
    return entry

def get_recent_outfits(limit=5):
    """
    Fetch the most recent outfits.
    Default limit is 5 for quick previews, (but can be adjusted).
    """
    outfits = _load_outfits()
    return outfits[:limit]

def search_outfits_by_tags_and_theme(tags, theme):
    """
    Search outfits by tags and optionally filter by theme.
    Args:
        tags (list[str]): list of tags to filter outfits by
        theme (str, optional): theme filter (case-insensitive). If empty/None, theme filter is skipped.
    Returns:
        list[dict]: outfits that match the given tags (all tags must be present) and theme (if provided).
    """
    outfits = _load_outfits()
    results = []
    
    for o in outfits:
        # Normalize stored tags to lowercase for case-insensitive matching
        outfits_tags = [t.lower() for t in o.get("tags", [])]

        # ✅ Theme filter: passes if no theme provided or matches outfit theme
        theme_match = not theme or o.get("theme", "").lower() == theme.lower()

        # ✅ Tags filter: only include outfit if All search tags are present
        tags_match = all(tag.lower() in outfits_tags for tag in tags)

        if tags_match and theme_match:
            results.append(o)

    return results

def sort_outfits(outfits, sort_key):
    """
    Sort outfits based on the selected key.
    Args:
        outfits (list[dict]): list of outfit entries to sort.
        sort_key (str): sorting criterion ("newest", "oldest", "alphabetical").
    Returns:
        list[dict]: sorted list of outfits.
    """
    # 🆕 ADDED: sorting utility for different view if outfit data.
    # Sorting provides better UX when viewing outfits by user preferences.

    if sort_key == "newest":
        # Sort by newest first (decending by timestamp)
        return sorted(outfits, key=lambda o: o.get("timestamp", ""), reverse=True)
    
    if sort_key == "oldest":
        # Sort by oldest first (ascending by timestamp)
        return sorted(outfits, key=lambda o: o.get("timestamp", ""))
    
    if sort_key == "alphabetical":
        # Sort alphabetically by caption (case-insensitive)
        return sorted(outfits, key=lambda o: o.get("caption", "").lower())
    
    # Default: return unsorted list if invalid sort key provided
    return outfits
# backend/app/services/outfit_service.py
import json
import os
from datetime import datetime

# Path where outfits will be stored (inside backend/data/outfits.json)
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data", "outfits.json")

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

def search_outfits_by_tag(tags):
    """
    Search outfits that contain a given tag.
    Args:
        tags (list[str]): list of tags to filter outfits by
    Returns:
        list[dict]: outfits whose tag list includes the given tag
    """
    outfits = _load_outfits()
    results = []
    
    for o in outfits:
        # Normalize stored tags to lowercase for case-insensitive matching
        outfits_tags = [t.lower() for t in o.get("tags", [])]

        # ✅ Ensure All search tags must be present in the outfit's tags list
        if all(tag.lower() in outfits_tags for tag in tags):
            results.append(o)

    return results
# backend/app/services/outfit_service.py
import json
import os
from datetime import datetime

# New: Define path where outfits data will will be persisted (inside backend/data/)
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data", "outfits.json")

def _load_outfits():
    """
    Load all outfits from JSON file.
    Return [] if file is missing or unreadable.
    This makes the service fault-tolerant for first-time use.
    """
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except Exception:
        # If file is corrupted or unreadable, return empty list instead of crashing
        return []
    
def _save_outfits(outfits):
    """
    Save all outfits back to JSON file.
    Keep JSON indented for easier debugging and inspection.
    """
    with open(DATA_FILE, "w") as f:
        json.dump(outfits, f, indent=2)
    
def _save_outfit(image_url, colours, theme):
    """
    Save a new outfit consisting of:
    - image_url: where the outfit image is stored
    - colours: extracted palette
    - theme: matched them result
    Each entry is timestamped to maintain history.
    """
    outfits = _load_outfits()
    entry = {
        "timestamp": datetime.utcnow().isoformat(), # New: track when the outfit was saved
        "image_url": image_url,
        "colours": colours,
        "theme": theme
    }
    outfits.insert(0, entry)  # New: Insert at the beginning so newest is always first
    _save_outfits(outfits)
    return entry

def get_recent_outfits(limit=5):
    """
    Fetch the most recent outfits.
    Default limit is 5 for quick previews, (but can be adjusted).
    """
    outfits = _load_outfits()
    return outfits[:limit]


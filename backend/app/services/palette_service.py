# 📄 backend/app/services/palette_service.py (New)

"""
Persistence layer for colour palettes.
- Stores palettes as JSON (simple file-based storage).
- Provides helper functions to save and fetch palettes.
- Future-ready: can be swapped for a real DB without changing route logic.
"""

import json
import os
from datetime import datetime

# Location of our JSON "database" file
DATA_FILE = os.path.join(os.path.dirname(__file__), "../../data/palettes.json")

def _load_data():
    """Load all palettes from JSON file (returns [] if file does not exist)."""
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def _save_data(data):
    """Persist palettes list back into the JSON file with indentation."""
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

def save_palette(image_url, colours, theme):
    """
    Save a new colour palette entry.
    Schema of each entry:
    {
        "timestamp": <UTC ISO8601 string>
        "image_url": <str>,
        "colours": <list of hex colour strings>,
        "theme": <str>    
    }
    - Adds new palettes at the top of the list (most recent first).
    - Returns the saved entry for immediate use.
    """
    data = _load_data()
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "image_url": image_url,
        "colours": colours,
        "theme": theme
    }
    data.insert(0, entry) # push new entry to the front
    _save_data(data)
    return entry

def get_recent_palettes(limit=5)
    """
    Retrieve the most recent colour palettes.
    - Default limit is 5 newest entries.
    - Slices the JSON data list instead of loading everthing into memory.
    """
    data = _load_data()
    return data[:limit]
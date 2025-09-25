"""
Palettes Routes
---------------
This file exposes endpoints to:
- Save a new palette (POST /api/palettes/save)
- Retrieve recent palettes (GET /api/palettes/recent)

It acts as the controller layer:
- Validates HTTP request input
- Delegates persistence logic to `palette_service`
- Returns clean JSON responses for the frontend	
"""

from flask import Blueprint, request, jsonify
from app.services import palette_service

#  Define a blueprint (modular grouping of routes) for palettes
palettes_bp = Blueprint("palettes", __name__, url_prefix="/api/palettes")

@palettes_bp.route("/save", methods=["POST"])
def save_palette():
    """
    Save a new palette.
    Expected JSON body:
    {
        "imageUrl": "<string>", # URL of processed image
        "colours": ["#RRGGBB", ...] # List of extracted hex colours strings
        "theme": "<string>" # matched theme name
    }
    - Validates request data
    - Persists palette entry using `palette_service.save_palette`.
    - Returns save emtry with 201 status on success.
    """
    try:
        payload = request.get_json() # Parse JSON body

        image_url = payload.get("imageUrl")
        colours = payload.get("colours", [])
        theme = payload.get("theme", "Unknown") # fallback if missing

        # Basic input validation
        if not image_url or not colours:
            return jsonify({"error": "Missing imageUrl or colours"}), 400
        
        # Save via service layer (decoupled from route logic)
        entry = palette_service.save_palette(image_url, colours, theme)
        return jsonify({"message": "Palette saved", "entry": entry}), 201
    
    except Exception as e:
        # Catch-all for unexpected runtime errors
        return jsonify({"error": str(e)}), 500
    
@palettes_bp.route("/recent", methods=["GET"])
def get_recent_palettes():
        """
        Fetch the most recent palettes.
        Optional query param:
          ?limit=N (default = 5)
        - Delegates to `palette_service.get_recent_palettes`.
        - Returns list of palettes in descending order (newest first).
        """
        try:
            limit = int(request.args.get("limit", 5)) # Default = 5
            data = palette_service.get_recent_palettes(limit)
            return jsonify({"palettes": data}), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
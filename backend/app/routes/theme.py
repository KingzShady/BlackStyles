"""
Theme Route
- Exposes POST /api/theme endpoint
- Accepts a JSON body with 'palette': list of hex colors
- Returns a JSON with 'theme': one of 'Spring', 'Summer', 'Autumn', 'Winter', 'Neutral'
"""

from flask import Blueprint, request, jsonify
from app.services.theme_matcher import match_theme

# Blueprint allows modular route registration
theme_bp = Blueprint("theme_bp", __name__)

# POST /api/theme
@theme_bp.route("/api/theme", methods=["POST"])
def api_theme():
    """ 
    Handle POST /api/theme 
    - Expect JSON: {'palette': ['#aabbcc', ...]} 
    - Returns: {"theme": "Spring"} or error message
    """

    # Parse JSON safely
    data = request.get_json(force=True, silent=True)
    if not data or 'palette' not in data:
        return jsonify({"error": "Palette missing in request body"}), 400
    
    palette = data.get("palette", [])

    try:
        # Match palette to a seasonal theme
        theme = match_theme(palette)
        return jsonify({"theme": theme}), 200
    except Exception as e:
        # Catch-all for unexpected errors
        return jsonify({"error": f"Failed to match theme: {str(e)}"}), 500
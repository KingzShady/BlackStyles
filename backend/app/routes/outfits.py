# backend/app/routes/outfits.py
from flask import Blueprint, request, jsonify
from app.services import outfit_service

# Define a Flask Blueprint for outfit-related API routes
outfits_bp = Blueprint("outfits", __name__, url_prefix="/api/outfits")

@outfits_bp.route("/save", methods=["POST"])
def save_outfit():
    """
    Save an outfit entry.
    Expects JSON body containing:
    - image_url: URL of the outfit image
    - colours: extracted colour palette (list of hex values)
    - theme: dectected theme for the outfit
    - caption: (optional) descriptive text provided by the user
    Returns saved entry with metadata.
    """
    data = request.json
    image_url = data.get("image_url")
    colours = data.get("colours")
    theme = data.get("theme")
    caption = data.get("caption", "") # ✅ NEW: optional caption field

    # Validate required fields to prevent saving incomplete data
    if not image_url or not colours:
        return jsonify({"error": "Missing imageUrl or colours fields"}), 400
    
    # ✅ UPDATED: pass caption into service layer
    entry = outfit_service._save_outfit(image_url, colours, theme, caption)
    return jsonify({"message": "Outfit saved", "entry": entry}), 201

@outfits_bp.route("/recent", methods=["GET"])
def get_recent_outfits():
    """
    Fetch the most recent outfits.
    Accepts optional query param:
    - limit: number of outfits to return (default 5)
    """
    limit = int(request.args.get("limit", 5))
    outfits = outfit_service.get_recent_outfits(limit=limit)
    return jsonify({"outfits": outfits})
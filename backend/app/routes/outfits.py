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
    - tags: (optional) list of user-specified tags for categorization
    Returns saved entry with metadata.
    """
    data = request.json
    image_url = data.get("image_url")
    colours = data.get("colours")
    theme = data.get("theme")
    caption = data.get("caption", "")
    tags = data.get("tags", []) # ✅ allow tags persistence

    # Validate required fields to prevent saving incomplete data
    if not image_url or not colours:
        return jsonify({"error": "Missing imageUrl or colours fields"}), 400
    
    # ✅ pass tags into service layer
    entry = outfit_service._save_outfit(image_url, colours, theme, caption, tags)
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

# 🔹 UPDATED: search outfits by mutiple tags instead of a single tag
@outfits_bp.route("/search", methods=["GET"])
def search_outfits():
    """
    Search outfits by one or more tags.
    Accepts query param:
    - tag: (required) comma-separated list of tags (e.g. "casual,blue")
    Returns a list of matching outfits.
    """
    tags_param = request.args.get("tags", "").strip()

    # ✅ Validate that query param exists
    if not tags_param:
        return jsonify({"error": "Missing tags"}), 400
    
    # ✅ Support mutiple tags by splitting on commas and trimming whitespace
    tags = [t.strip() for t in tags_param.split(",") if t.strip()]

    # Delegate to service layer for filtering logic
    results = outfit_service.search_outfits_by_tag(tags)
    return jsonify({"outfits": results}), 200
# backend/app/routes/outfits.py
from flask import Blueprint, request, jsonify
from app.services import outfit_service

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
    pass

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
    Enhance search API endpoint with pagination support.
    Accepts query param:
    - tags: (optional) comma-separated list of tags (e.g., "casual,blue")
    - theme: (optional) outfit theme to filter by (e.g., "summer")
    - sort: (optional) sorting criteria (e.g., "newest")
    - page: (optional) current page number (default=1)
    - limit:(optional) number of items per page (default=10)

    Returns a paginated list of outfits filtered by given criteria.
    """
    # ✅ Extract and sanitize query parameters
    tags_param = request.args.get("tags", "").strip()
    theme = request.args.get("theme", "").strip()
    sort = request.args.get("sort", "").strip()
    page = int(request.args.get("page", 1)) # ✅ ADDED: current page number
    limit = int(request.args.get("limit", 10)) # ✅ ADDED: items per page
    
    # ✅ Convert comma-separated tags into a list
    tags = [t.strip() for t in tags_param.split(",") if t.strip()] if tags_param else []

    # ✅ Fetch results from service layer (filtered by tags + theme)
    results = outfit_service.search_outfits_by_tags_and_theme(tags, theme)

    # ✅ Apply sorting if requested by client
    if sort:
        results = outfit_service.sort_outfits(results, sort)
    
    # ✅ Pagination logic: determine slice of results to return
    start = (page - 1) * limit
    end = start + limit
    paginated_results = results[start:end]

    # ✅ Include pagination metadata for frontend display
    return jsonify({
        "outfits": paginated_results,
        "page": page,
        "limit": limit,
        "total": len(results), # total number of matched outfits
        "total_pages": (len(results) + limit - 1) // limit # total pages (rounded up)
        }), 200
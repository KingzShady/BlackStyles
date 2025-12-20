# backend/app/routes/outfits.py
from flask import Blueprint, request, jsonify
from app.services import outfit_service
from app.services.auth_service import decode_token # 🆕 ADDED: JWT decoding utility

outfits_bp = Blueprint("outfits", __name__, url_prefix="/api/outfits")

# =========================
# 🔐 JWT Helper
# =========================

def get_user_id_from_header():
    """
    Extract and decode JWT from Authorization header.

    WHY:
    - JWT verfication belongs in the route layer, not services
    - Ensures user udentity is trusted before calling business logic
    """
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.replace("Bearer ", "")
    decode = decode_token(token)

    # Defensive check to avoid KeyErrors and invalid tokens
    return decoded.get("user_id") if decoded else None

# =========================
# Outfit Routes
# =========================

@outfits_bp.route("/save", methods=["POST"])
def save_outfit():
    data = request.json

    image_url = data.get("image_url")
    colours = data.get("colours")
    theme = data.get("theme")
    caption = data.get("caption", "")
    tags = data.get("tags", [])

    if not image_url or not colours:
        return jsonify({"error": "Missing imageUrl or colours fields"}), 400
    
    entry = outfit_service._save_outfit(
        image_url=image_url, 
        colours=colours, 
        theme=theme, 
        caption=caption, 
        tags=tags
    )

    return jsonify({"message": "Outfit saved", "entry": entry}), 201

@outfits_bp.route("/recent", methods=["GET"])
def get_recent_outfits():
    limit = int(request.args.get("limit", 5))
    outfits = outfit_service.get_recent_outfits(limit=limit)
    return jsonify({"outfits": outfits})

@outfits_bp.route("/search", methods=["GET"])
def search_outfits():
    tags_param = request.args.get("tags", "").strip()
    theme = request.args.get("theme", "").strip()
    sort = request.args.get("sort", "").strip()
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    
    tags = [t.strip() for t in tags_param.split(",") if t.strip()] if tags_param else []

    results = outfit_service.search_outfits_by_tags_and_theme(tags, theme)

    if sort:
        results = outfit_service.sort_outfits(results, sort)
    
    start = (page - 1) * limit
    end = start + limit

    return jsonify({
        "outfits": results[start:end],
        "page": page,
        "limit": limit,
        "total": len(results),
        "total_pages": (len(results) + limit - 1) // limit
        }), 200

# =========================
# ⭐ Favorites (JWT-Protected)
# =========================

@outfits_bp.route("/favorite", methods=["POST"])
def save_favorite():
    """
    Save an outfit to the authenticated user's favorites.

    WHY:
    - User identity is derived exclusively from JWT
    - Prevents spoofing user IDs via request body
    """
    user_id = get_user_id_from_header()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    outfit_id = data.get("outfit_id")

    if not outfit_id:
        return jsonify({"error": "Missing outfit_id field"}), 400
    
    outfit_service.save_favorite(user_id, outfit_id)
    return jsonify({"message": "Outfit added to favorites"}), 200

@outfits_bp.route("/favorites", methods=["GET"])
def get_favorites():
    """
    Retrieve authenticated user's favorite outfits.

    WHY:
    - Favorites are private per user
    - JWT ensures proper ownership and access control 
    """
    user_id = get_user_id_from_header()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    favorites = outfit_service.get_favorites(user_id)
    return jsonify({"favorites": favorites}), 200
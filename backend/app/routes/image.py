# backend/app/routes/image.py

from flask import Blueprint, request, jsonify
from app.services.color_palette import extract_palette
import tempfile
import os

# Define a Flask blueprint for image-related routes
image_bp = Blueprint("image", __name__)

@image_bp.route("/upload", methods=["POST"])
def upload_image():
    # Ensure an image file is included in the request
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]

    # Create a temporary file to safely store the uploaded image
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        image_path = temp.name
        image_file.save(image_path)

    try:
        # Extract the top 5 dominant colors from the image
        palette = extract_palette(image_path, k=5)
        return jsonify({"palette": palette})
    except Exception as e:
        # Return any error that occurred during processing
        return jsonify({"error": str(e)}), 500
    finally:
        # Always clean up the temp file, even if an error occurred
        os.remove(image_path)

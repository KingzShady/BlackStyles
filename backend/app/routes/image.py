# backend/app/routes/image.py

from flask import Blueprint, request, jsonify
from app.services.color_palette import extract_palette
import tempfile
import os

# Define a Flask blueprint for image-related routes
image_routes = Blueprint("image", __name__)

# Define allowed image extensions for upload security
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@image_routes.route("/upload", methods=["POST"])
def upload_image():
    # Get the file from the request payload
    file = request.files.get('image')

    # Check if file exists and has a valid name
    if file is None or file.filename == '':
        return jsonify({"error": "No file provided"}), 400
    
    # Check if the file has an allowed extension (JPG, JPEG, or PNG)
    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type. Please upload a JPG, JPEG, or PNG image."}), 400

    # Create a temporary file to safely store the uploaded image
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        image_path = temp.name
        file.save(image_path)

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

# backend/app/routes/image.py

import logging # Enables backend event tracking
from flask import Blueprint, request, jsonify
from app.services.color_palette import extract_palette
import tempfile
import os
import cv2
import numpy as np
from app.utils.image_utils import crop_center # Utility to crop image center

# ✅ NEW: allow palette routes (history, retrieval, etc.)
from app.routes.palettes import palettes_bp

# Set up basic logging configuration
logging.basicConfig(level=logging.INFO)

# Define a Flask blueprint for image-related routes
image_routes = Blueprint("image", __name__)

# Define a Flask blueprint for API-related routes
api_bp = Blueprint('api', __name__)

# ✅ Register persistence-related routes under the unified API
api_bp.register_blueprint(palettes_bp)

# Define allowed image extensions for upload security
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@image_routes.route('/upload', methods=["POST"])
def upload_image():
    """
    Handle image uploads:
    - Validate file type (JPG, JPEG, PNG)
    - Save temporarily for processing
    - Crop image center (200x200 pixels)
    - Extract top 5 dominant colors
    - Return palette as JSON
    """

    # Get the file from the request payload
    file = request.files.get('image')

    # Check if file exists and has a valid name
    if file is None or file.filename == '':
        return jsonify({"error": "No file provided"}), 400
    
    # Check if the file has an allowed extension (JPG, JPEG, or PNG)
    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type. Please upload a JPG, JPEG, or PNG image."}), 400

    # Log request and file metadata for debugging and audit purposes
    logging.info(f"[UPLOAD] Received request from {request.remote_addr}")
    logging.info(f"[UPLOAD] Filename: {file.filename}")
    logging.info(f"[UPLOAD] Content-Type: {file.content_type}")

    # Create a temporary file to safely store the uploaded image
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        image_path = temp.name
        file.save(image_path)

    try:
        # Load the image from saved file
        image = cv2.imread(image_path)

        # Check if the image was loaded successfully
        if image is None or image.size == 0:
            raise ValueError("Failed to load image from file.")
        
        # Crop the center 200x200 pixels from the image (adjust size as needed)
        cropped_img = crop_center(image, 200, 200)

        # Save cropped image temporarily for palette extraction
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_cropped:
            cropped_path = temp_cropped.name
            cv2.imwrite(cropped_path, cropped_img)

        # Extract the top 5 dominant colors from the image
        palette = extract_palette(cropped_path, k=5)
        return jsonify({"palette": palette})
    
    except Exception as e:
        # Log the error and respond with a user-friendly message
        logging.error(f"[ERROR] Failed to process image: {str(e)}")
        return jsonify({"error": "Failed to read or process image. Please upload a valid JPG, JPEG or PNG."}), 400

    finally:
        # Clean up any temporary files if created
        if 'cropped_path' in locals() and os.path.exists(cropped_path):
            os.remove(cropped_path)

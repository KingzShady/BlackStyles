# backend/app/routes/image.py

import logging # Enables backend event tracking
from flask import Blueprint, request, jsonify
from app.services.color_palette import extract_palette
import tempfile
import os
import cv2
import numpy as np
from app.utils.image_utils import crop_center # Utility to crop image center

# Set up basic logging configuration
logging.basicConfig(level=logging.INFO)

# Define a Flask blueprint for image-related routes
image_routes = Blueprint("image", __name__)

# Define allowed image extensions for upload security
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@image_routes.route('/upload', methods=["POST"])
def upload_image():
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
        # Read image via OpenCV in BGR color space
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Invalid image file")
        
        # Crop the center 200x200 pixels from the image (adjust size as needed)
        cropped_img = crop_center(image, 200, 200)

        # save the cropped image temporarily for palette extraction
        cropped_path = image_path + "_cropped.jpg"
        cv2.imwrite(cropped_path, cropped_img)

        # Extract the top 5 dominant colors from the image
        palette = extract_palette(cropped_path, k=5)

        return jsonify({"palette": palette})
    
    except Exception as e:
        # Return any error that occurred during processing
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up temporary files
        os.remove(image_path)
        if os.path.exists(cropped_path):
            os.remove(cropped_path)

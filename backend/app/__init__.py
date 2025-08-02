from flask import Flask
from flask_cors import CORS # Allows cross-origin requests (essential for frontend-backend communication)

def create_app():
    # Initialize the Flask app instance
    app = Flask(__name__)

    # Enable CORS so the frontend (e.g., React) can communicate with the backend
    CORS(app)

    # Import and register the image-related routes as a blueprint
    from .routes.image import image_bp
    app.register_blueprint(image_bp, url_prefix="/api/image") # All image routes will be under /api/image

    # Return the configured Flask app instance
    return app
# backend/app/__init__.py
from flask import Flask
from flask_cors import CORS # Allows cross-origin requests (essential for frontend-backend communication)

def create_app():
    # Initialize the Flask app instance
    app = Flask(__name__)

    # Enable CORS so the frontend (e.g., React) can communicate with the backend
    CORS(app)

    # Import and register the image-related routes as a blueprint
    from .routes.image import image_routes
    from .routes.test import test_routes # Registering new test route for backend verification
    
    # Register image-related routes under /api/image
    app.register_blueprint(image_routes, url_prefix="/api/image") # This allows image upload and color extraction functionality

    # Register test routes under /api/test
    app.register_blueprint(test_routes) # This allows quick health checks of the backend

    # Return the fully configured app instance
    return app
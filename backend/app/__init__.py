# backend/app/__init__.py
"""
Flask app factory
- Initializes Flask instance
- Enables CORS for frontend-backend communication
- Registers Blueprints for modular routes:
  - image routes (/api/image)
  - test routes (/api/test)
  - theme routes (/api/theme) ← newly added
"""

from flask import Flask
from flask_cors import CORS # Allows cross-origin requests (essential for frontend-backend communication)

def create_app():
    # Initialize the Flask app instance
    app = Flask(__name__)

    # Enable CORS so the frontend (e.g., React) can communicate with the backend
    CORS(app)

    # Import and register the image-related routes as a blueprint
    from .routes.routes import image_routes, api_bp # Importing existing image and API routes
    from .routes.test import test_routes # Registering new test route for backend verification
    from .routes.theme import theme_bp # Import the new theme routes
    
    # Register image-related routes under /api/image
    app.register_blueprint(image_routes, url_prefix="/api/image") # This allows image upload and color extraction functionality

    # Register test routes under /api/test
    app.register_blueprint(test_routes) # This allows quick health checks of the backend

    # Register theme-related routes under /api/theme
    app.register_blueprint(theme_bp) # This allows palette to theme matching functionality

    # Register the main API blueprint which contains the palettes routes
    app.register_blueprint(api_bp)

    # Return the fully configured app instance
    return app
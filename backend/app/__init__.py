# backend/app/__init__.py
"""
Flask App Factory
-----------------
- Creates and configures the Flask backend app.
- Enables CORS so the React frontend can talk to the backend.
- Registers all routes blueprints (Modular APIs):
  - /api/image    → Image upload + color extraction
  - /api/test     → Health check endpoint
  - /api/theme    → Palette → theme matching
  - /api/outfit   → Outfit persistence layer (New ✅)
"""

from flask import Flask
from flask_cors import CORS # Allows cross-origin requests (essential for frontend-backend communication)


def create_app():
    # Initialize the Flask app instance
    app = Flask(__name__)

    # Enable cross-origin requests (important when frontend & backend run on different ports)
    CORS(app)

    # Import existing routes blueprints locally to avoid circular imports
    from .routes.routes import image_routes, api_bp
    from .routes.test import test_routes
    from .routes.theme import theme_bp
    from .routes.outfits import outfits_bp # ✅ NEW: Import the new outfits blueprint
    
    # Register image routes (upload + extract colours)
    app.register_blueprint(image_routes, url_prefix="/api/image")

    # Register test routes (backend health check)
    app.register_blueprint(test_routes) 

    # Register theme routes (palette → theme matching)
    app.register_blueprint(theme_bp)

    # Register palettes routes (already grouped under api_bp)
    # app.register_blueprint(api_bp)

    # ✅ NEW: Register outfits persistence routes
    app.register_blueprint(outfits_bp)

    # Return the fully configured app instance
    return app
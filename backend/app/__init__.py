# backend/app/__init__.py
"""
Flask App Factory
-----------------
WHY THIS FILE EXISTS:
- Central place where Flask app is composed.
- Ensures all feature modules (routes) are registered.
- Keeps application startup predictable and testable.
"""

from flask import Flask
from flask_cors import CORS # Enables frontend ↔ backend communication

def create_app():
    # Initialize Flask application instance
    app = Flask(__name__)

    # Enable CORS globally so the React frontend can access APIs
    CORS(app)

    # Import blueprints *inside* factory to avoid circular dependencies
    from .routes.routes import image_routes
    from .routes.test import test_routes
    from .routes.theme import theme_bp
    from .routes.outfits import outfits_bp
    from .routes.auth import auth_bp # 🆕 ADDED: Authentucation routes
    
    # Register image processing routes
    app.register_blueprint(image_routes, url_prefix="/api/image")

    # Register health-check routes
    app.register_blueprint(test_routes) 

    # Register theme detection routes
    app.register_blueprint(theme_bp)

    # Register outfits persistence routes
    app.register_blueprint(outfits_bp)

    # 🆕 ADDED: Register authentication routes (/api/auth/*)
    # WHY: Makes login & registration endpoints available to the app
    app.register_blueprint(auth_bp)

    # Return the fully configured app instance
    return app
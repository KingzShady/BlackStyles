# backend/app/routes/test.py

from flask import Blueprint, jsonify

# Create a new blueprint for test-related routes
test_routes = Blueprint("test_routes", __name__)

# Define a simple GET route to verify the API is responsive
@test_routes.route("/api/test", methods=["GET"])
def test_api():
    # Return a JSON response with a success message and HTTP 200 status
    return jsonify({
        'status': 'ok',
        'message': 'Test route working!'
    }), 200
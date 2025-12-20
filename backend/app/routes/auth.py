"""
Authentication Routes

WHY THIS FILE EXISTS:
- Exposes HTTP endpoints for user registration and login.
- Delegates security logic to auth_service (single responsibility).
- Keeps routes thin and readable.
"""

from flask import Blueprint, request, jsonify
from app.services.mongo_service import get_collection
from app.services.auth_service import (
    hash_password,
    verify_password,
    generate_token,
)

# 🔹 ADDED: Dedicated auth blueprint to keep concerns isolated
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user.
    
    WHY:
    - Validates uniqueness of email
    - Hashes password before persistence
    - Prevents duplicate accounts
    """
    users = get_collection("users")
    data = request.json or {}

    # 🔐 ADDED: Guard against missing fields
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    # 🔐 ADDED: Enforce unqiue email constraint
    if users.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400
    
    # 🔐 ADDED: Password is hashed before storage (never plain text)
    users.insert_one({
        "email": data["email"],
        "password": hash_password(data["password"]),
    })
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate a user and issue a JWT.

    WHY:
    - Verifies credentials securely
    - Issues stateless JWT for future requests
    """

    users = get_collection("users")
    data = request.json or {}

    # 🔐 ADDED: Guard against missing fields
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400
    
    user = users.find_one({"email": data["email"]})

    # 🔐 ADDED: Unified error to avoid leaking account existence
    if not user or not verify_password(data["password"], user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # 🪪 ADDED: Generate JWT tied to user ID
    token = generate_token(str(user["_id"]))

    return jsonify({"token": token}), 200
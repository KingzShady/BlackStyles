# backend/app/services/auth_service.py
"""
Authentication Service Layer

WHY THIS FILE EXISTS:
- Keeps authentication logic out of route handlers.
- Centralizes password hashing and JWT logic.
- Makes auth easier to test, maintain and extend (refresh tokens, roles, etc.)

This file should NOT know about Flask request/response objects.
"""
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os

# 🔐 ADDED: Load secret from enviroment for security
# Fallback exists ONLY for local development
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-key") # ⚠️ Change in production
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 24 # Token validity duration

# 🔹 ADDED: Password Hashing Helper
def hash_password(password: str) -> str:
    """
    Hash a plaintext password before storing it in the database.

    WHY:
    - Passwords must Never be stored in plain text
    - Werzeug uses a secure, salted hashing algorithm
    """
    return generate_password_hash(password)

# 🔹 ADDED: Password Verification Helper
def verify_password(password: str, hashed: str) -> bool:
    """
    Compare a plaintext against a stored hash.

    WHY:
    - Prevents timing attacks
    - Ensures user authentication logic stays consistent
    """
    return check_password_hash(hashed, password)

# 🔹 ADDED: JWT Generation Helper
def generate_token(user_id: str) -> str:
    """
    Generate a signed JWT for an authenticated user.

    WHY:
    - JWTs allow stateless authentication
    - No server-side session storage needed
    - Token includes expiry for security
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() 
        + datetime.timedelta(hours=JWT_EXPIRY_HOURS),
    }

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# 🔹 ADDED: JWT Decoding + Validation Helper
def decode_token(token: str):
    """
    Decode and validate a JWT.

    WHY:
    - Ensures token integrity and expiry
    - Centralizes token handling logic
    - Makes it reusable for Middleware / Decorators later
    """
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
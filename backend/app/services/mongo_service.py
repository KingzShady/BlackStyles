# backend/app/services/mongo_service.py
from pymongo import MongoClient
import os

#-------------------------------------------------
# Configuration
#-------------------------------------------------
# I retrieve the MongoDB connection URI from environment variables for security.
# This ensures I don't hardcode sensitive information like creadentials in the codebase.
MONGO_URI = os.getenv("MONGO_URI", "")

# default database name for this application
DB_NAME = "blackstyles_db"

# Global variables for MongoDB client and database references.
# These will be initialized once and reused throughout the app.
client = None
db = None

def init_mongo():
    """
    Initializes the MongoDB client and database connection.
    This function should be called when the backend starts.
    """
    global client, db # Use globals to ensure consistent connection reuse

    # ✅ ADDED: Introduced database connection URI
    if MONGO_URI:
        # Create a MongoDB client using connection URI
        client = MongoClient(MONGO_URI)

        # Select the database specified by DB_NAME
        db = client[DB_NAME]

        # Print a success message for easier debugging and mointoring
        print("MongoDB connected successfully.")
    else:
        # If no URI is found, fallback to JSON-based storage or mock data
        print("⚠️ MongoDB URI not found; using JSON fallback.")

def get_collection(name):
    """
    Returns a reference to a MongoDB collection by name.
    This allows other services or routes to perform CRUD operations.
    """
    # ✅ ADDED: Provides safe access to collections
    if db:
        return db[name]
    return None # If DB is not initialized, return None to prevent runtime errors
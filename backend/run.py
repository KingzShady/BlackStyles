# Entry point of the application — this is where the app starts
from app import create_app

# Create an instance of the Flask application using the factory pattern
app = create_app()

# Only run the server if this script is executed directly (not imported as a module)
if __name__ == '__main__':
    app.run(debug=True) # Start the development server with debug mode on (auto-reloads + helpful errors)
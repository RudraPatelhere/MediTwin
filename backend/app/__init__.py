from flask import Flask
from flask_cors import CORS

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    CORS(app)  # Enable CORS for frontend integration

    # Import routes after creating app to avoid circular imports
    from .routes import configure_routes

    # Configure routes
    configure_routes(app)

    return app
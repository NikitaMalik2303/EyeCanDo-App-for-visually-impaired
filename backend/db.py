from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.dialects.postgresql import ARRAY

# Initialize SQLAlchemy and Migrate
db = SQLAlchemy()
migrate = Migrate()


def init_db(app):
    """
    Initialize the database with the Flask app
    """
    db.init_app(app)
    migrate.init_app(app, db)


# Define a User model for authentication
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="user")
    contacts = db.Column(ARRAY(db.String(150)), nullable=True, server_default="{}")
    phoneNumber = db.Column(db.String(150), nullable=True)
    lastLogin = db.Column(db.DateTime, nullable=True)
    # device_token = db.Column(db.String(255), nullable=True)  # New column for device token


class Community(db.Model):
    __tablename__ = "communities"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Float, nullable=False, default=0.0)
    timestamp = db.Column(db.DateTime, nullable=False)
    # Add any other columns here as needed


# Add any other models here as needed

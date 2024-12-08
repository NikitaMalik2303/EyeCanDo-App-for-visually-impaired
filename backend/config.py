import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "randomkey")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "postgresql://flaskuser:securepassword@localhost:5432/flaskapp"
    )
    JWT_SECRET_KEY = os.getenv("SECRET_KEY", "randomkey")
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 60 * 1  # 1 hour
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE = (
        "filesystem"  # For storing sessions locally (can use Redis in production)
    )

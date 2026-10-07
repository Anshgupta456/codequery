"""Authentication module for user credentials and sessions."""
import hashlib
from typing import Optional

SECRET_KEY = "test-secret"


def hash_password(password: str) -> str:
    """Hash a plaintext password with SHA256."""
    return hashlib.sha256((password + SECRET_KEY).encode()).hexdigest()


class AuthService:
    """Handles user authentication and session management."""

    def __init__(self, db_client):
        self.db = db_client

    def login(self, username: str, password: str) -> bool:
        """Authenticate user credentials."""
        hashed = hash_password(password)
        return self.db.check_user(username, hashed)

    def logout(self, user_id: str) -> None:
        """Invalidate session for user."""
        self.db.clear_session(user_id)

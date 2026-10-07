"""Authentication module for user credentials and sessions."""
import hashlib
from typing import Optional

SECRET_KEY = "super-secret-key"


def hash_password(password: str) -> str:
    """Hash a plaintext password with SHA-256 and salt."""
    salted = f"{password}:{SECRET_KEY}"
    return hashlib.sha256(salted.encode("utf-8")).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify that a plaintext password matches the hashed password."""
    return hash_password(plain_password) == hashed_password


class AuthService:
    """Service handling user login, registration, and logout."""

    def __init__(self, db_client):
        self.db = db_client

    def login(self, username: str, password: str) -> Optional[dict]:
        """Authenticate user against database."""
        user = self.db.find_user(username)
        if user and verify_password(password, user["password_hash"]):
            return {"user_id": user["id"], "username": username}
        return None

    def logout(self, user_id: str) -> bool:
        """Clear user session token."""
        return self.db.invalidate_session(user_id)

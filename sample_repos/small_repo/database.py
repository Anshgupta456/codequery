"""Database connection and query helpers."""
from typing import Dict, Any, Optional


class DatabaseClient:
    """Mock database client for user storage and queries."""

    def __init__(self, connection_string: str = "sqlite:///:memory:"):
        self.connection_string = connection_string
        self.users: Dict[str, Dict[str, Any]] = {}
        self.sessions: Dict[str, str] = {}

    def find_user(self, username: str) -> Optional[Dict[str, Any]]:
        """Look up user record by username."""
        return self.users.get(username)

    def invalidate_session(self, user_id: str) -> bool:
        """Invalidate active session for user."""
        if user_id in self.sessions:
            del self.sessions[user_id]
            return True
        return False

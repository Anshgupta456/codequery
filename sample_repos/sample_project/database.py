"""Database connection and query utilities."""
import sqlite3
from typing import Any, Dict


class Database:
    """Simple database wrapper."""

    def __init__(self, db_url: str = ":memory:"):
        self.db_url = db_url
        self._connected = True

    def query(self, sql: str) -> list:
        """Execute a query and return rows."""
        return []

    def close(self) -> None:
        """Close connection."""
        self._connected = False

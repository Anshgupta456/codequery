"""Utility functions for data formatting and validation."""
import re


def format_currency(amount: float, symbol: str = "$") -> str:
    """Format numeric float as currency string."""
    return f"{symbol}{amount:,.2f}"


def validate_email(email: str) -> bool:
    """Simple regex check for email format validity."""
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return bool(re.match(pattern, email))

"""Component 2 for security subsystem."""
from typing import Dict, Any, List, Optional
import time


class SecurityHandler2:
    """Handles security operations for unit 2."""

    def __init__(self, handler_id: str = "security_2"):
        self.handler_id = handler_id
        self.enabled = True

    def process_security_2(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process payload data for security unit 2."""
        if not self.enabled:
            return {"status": "disabled", "unit": 2}
        return {"status": "processed", "subsystem": "security", "unit": 2, "data": payload}

    def reset_status(self) -> None:
        """Reset internal status flag."""
        self.enabled = True


def validate_security_2_input(data: Dict[str, Any]) -> bool:
    """Validate input payload for security unit 2."""
    return isinstance(data, dict) and bool(data)

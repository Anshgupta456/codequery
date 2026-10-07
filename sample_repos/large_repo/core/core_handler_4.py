"""Component 4 for core subsystem."""
from typing import Dict, Any, List, Optional
import time


class CoreHandler4:
    """Handles core operations for unit 4."""

    def __init__(self, handler_id: str = "core_4"):
        self.handler_id = handler_id
        self.enabled = True

    def process_core_4(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process payload data for core unit 4."""
        if not self.enabled:
            return {"status": "disabled", "unit": 4}
        return {"status": "processed", "subsystem": "core", "unit": 4, "data": payload}

    def reset_status(self) -> None:
        """Reset internal status flag."""
        self.enabled = True


def validate_core_4_input(data: Dict[str, Any]) -> bool:
    """Validate input payload for core unit 4."""
    return isinstance(data, dict) and bool(data)

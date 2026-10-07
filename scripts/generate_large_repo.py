"""Script to generate a synthetic large Python repository with 150+ files."""
import os
from pathlib import Path


def generate_large_repo(target_dir: Path, num_files: int = 160):
    """Generate a multi-package Python repository with 160+ files."""
    target_dir.mkdir(parents=True, exist_ok=True)

    modules = [
        "core", "auth", "billing", "api", "models",
        "services", "utils", "data", "notifications", "analytics",
        "integrations", "security", "reports", "tasks", "config"
    ]

    file_count = 0

    # Create packages and files
    for mod in modules:
        mod_dir = target_dir / mod
        mod_dir.mkdir(parents=True, exist_ok=True)

        init_file = mod_dir / "__init__.py"
        init_file.write_text(f'"""Module {mod} package initialization."""\n', encoding="utf-8")
        file_count += 1

        # Create 10 files per module
        for i in range(1, 11):
            file_name = f"{mod}_handler_{i}.py"
            file_path = mod_dir / file_name

            code = f'''"""Component {i} for {mod} subsystem."""
from typing import Dict, Any, List, Optional
import time


class {mod.capitalize()}Handler{i}:
    """Handles {mod} operations for unit {i}."""

    def __init__(self, handler_id: str = "{mod}_{i}"):
        self.handler_id = handler_id
        self.enabled = True

    def process_{mod}_{i}(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process payload data for {mod} unit {i}."""
        if not self.enabled:
            return {{"status": "disabled", "unit": {i}}}
        return {{"status": "processed", "subsystem": "{mod}", "unit": {i}, "data": payload}}

    def reset_status(self) -> None:
        """Reset internal status flag."""
        self.enabled = True


def validate_{mod}_{i}_input(data: Dict[str, Any]) -> bool:
    """Validate input payload for {mod} unit {i}."""
    return isinstance(data, dict) and bool(data)
'''
            file_path.write_text(code, encoding="utf-8")
            file_count += 1

    # Add specific cross-file business logic files to test multi-file queries
    # 1. services/checkout_service.py imports auth and billing
    checkout_file = target_dir / "services" / "checkout_service.py"
    checkout_file.write_text('''"""Order checkout service integrating auth, billing, and inventory."""
from auth.auth_handler_1 import AuthHandler1
from billing.billing_handler_1 import BillingHandler1
from typing import Dict, Any


class CheckoutService:
    """Coordinates customer order placement across auth and billing."""

    def __init__(self, auth_handler: AuthHandler1, billing_handler: BillingHandler1):
        self.auth = auth_handler
        self.billing = billing_handler

    def place_order(self, user_token: str, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate user session and process payment for order."""
        auth_res = self.auth.process_auth_1({"token": user_token})
        if auth_res.get("status") != "processed":
            raise PermissionError("User authentication failed during checkout.")

        charge_res = self.billing.process_billing_1(order_data)
        return {
            "order_status": "completed",
            "auth_status": auth_res["status"],
            "payment": charge_res,
        }
''', encoding="utf-8")
    file_count += 1

    # 2. analytics/audit_pipeline.py
    audit_file = target_dir / "analytics" / "audit_pipeline.py"
    audit_file.write_text('''"""Audit logging and security reporting pipeline."""
from security.security_handler_1 import SecurityHandler1
from typing import List, Dict, Any


class AuditPipeline:
    """Collects security audit events and compiles reports."""

    def __init__(self, security_handler: SecurityHandler1):
        self.security = security_handler
        self.events: List[Dict[str, Any]] = []

    def record_event(self, event_type: str, details: Dict[str, Any]) -> None:
        """Record and validate security audit event."""
        if self.security.process_security_1(details).get("status") == "processed":
            self.events.append({"type": event_type, "details": details})
''', encoding="utf-8")
    file_count += 1

    print(f"Generated {file_count} Python files in {target_dir}")
    return file_count


if __name__ == "__main__":
    out_dir = Path(__file__).resolve().parent.parent / "sample_repos" / "large_repo"
    generate_large_repo(out_dir)

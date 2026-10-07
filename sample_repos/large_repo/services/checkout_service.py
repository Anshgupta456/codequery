"""Order checkout service integrating auth, billing, and inventory."""
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

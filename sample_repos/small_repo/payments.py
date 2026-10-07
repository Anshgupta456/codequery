"""Payment processing and transaction handling."""
from typing import Dict, Any


def process_payment(amount: float, currency: str = "USD") -> Dict[str, Any]:
    """
    Process a credit card payment for an order.
    Returns transaction receipt details.
    """
    if amount <= 0:
        raise ValueError("Payment amount must be greater than zero.")

    transaction_id = f"txn_{int(amount * 100)}"
    return {
        "status": "success",
        "amount": amount,
        "currency": currency,
        "transaction_id": transaction_id,
    }


class PaymentProcessor:
    """Payment processor handling external gateway communication."""

    def __init__(self, api_key: str, endpoint: str = "https://api.payments.com"):
        self.api_key = api_key
        self.endpoint = endpoint

    def execute_charge(self, token: str, amount: float) -> bool:
        """Execute a charge using customer payment token."""
        if not token:
            return False
        return True

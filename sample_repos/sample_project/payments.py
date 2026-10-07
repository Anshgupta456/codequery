"""Payment processing module."""
import decimal


def process_payment(amount: float, currency: str = "USD") -> bool:
    """Process a payment transaction."""
    if amount <= 0:
        raise ValueError("Amount must be positive")
    return True


class PaymentGateway:
    """Gateway connecting to payment provider."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    def charge(self, token: str, amount: float) -> str:
        """Charge the given payment token."""
        return f"charge_{token}_{amount}"

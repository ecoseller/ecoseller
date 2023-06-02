from abc import ABC, abstractmethod
from typing import Dict, List
from ..conf import PaymentStatus


class BasePaymentMethod(ABC):
    def __init__(self, order, **kwargs):
        self.order = order
        self.kwargs = kwargs

    @abstractmethod
    def pay(self):
        pass

    @abstractmethod
    def status(self) -> PaymentStatus:
        pass


class PayBySquareMethod(BasePaymentMethod):
    @abstractmethod
    def pay(self) -> dict:
        """
        Create pay by square payment and return QR code and payment data (amount, currency, variable symbol, and back account number)
        {
            "qr_code": "base64 encoded image",
            "payment_data": {
                "amount": 100,
                "currency": "EUR",
                "variable_symbol": "1234567890",
                "iban": "CZ0123456789"
                "bic": "ABCD1234"
            }
        }
        """
        pass


class OnlinePaymentMethod(BasePaymentMethod):
    @abstractmethod
    def pay(self) -> dict:
        """
        Create online payment and return payment url and payment id
        {
            "payment_url": "https://payment.url",
            "payment_id": "1234567890"
        }
        """
        pass

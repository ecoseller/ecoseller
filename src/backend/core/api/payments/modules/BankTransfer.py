from .BasePaymentMethod import PayBySquareMethod
from ..conf import PaymentStatus


class BankTransfer(PayBySquareMethod):
    def pay(self):
        self.bic = self.kwargs.get("bic")
        self.iban = self.kwargs.get("iban")
        self.currency = self.kwargs.get("currency")
        self.variable_symbol = 123456789
        self.amount = 100

        return {
            "qr_code": "base64 encoded image",
            "payment_data": {
                "amount": self.amount,
                "currency": self.currency,
                "variable_symbol": self.variable_symbol,
                "iban": self.iban,
                "bic": self.bic,
            },
        }

    def status(self) -> PaymentStatus:
        """
        Moc status and return paid with some probability
        """
        import random

        if random.random() < 0.5:
            return PaymentStatus.PAID
        return PaymentStatus.PENDING

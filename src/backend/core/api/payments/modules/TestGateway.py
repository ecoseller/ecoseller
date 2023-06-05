from .BasePaymentMethod import OnlinePaymentMethod
from ..conf import PaymentStatus


class TestGateway(OnlinePaymentMethod):
    def pay(self):
        return {"payment_url": "https://payment.url", "payment_id": "1234567890"}

    def status(self) -> PaymentStatus:
        """
        Moc status and return paid with some probability
        """
        import random

        if random.random() < 0.5:
            return PaymentStatus.PAID
        return PaymentStatus.PENDING

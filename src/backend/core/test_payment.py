from api.payments.api import PaymentResolver
from order.models import Order


order = Order.objects.first()
p = PaymentResolver(order=order)

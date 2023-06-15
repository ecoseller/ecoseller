import uuid

from django.db import models
from enumchoicefield import ChoiceEnum, EnumChoiceField

from cart.models import Cart


class OrderStatus(ChoiceEnum):
    """
    Enum class for order status.
    """

    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    CANCELLED = "CANCELLED"


class Order(models.Model):
    """
    Object representing order of user.
    """

    token = models.UUIDField(primary_key=True, default=uuid.uuid4)
    create_at = models.DateTimeField(auto_now_add=True)
    status = EnumChoiceField(enum_class=OrderStatus, default=OrderStatus.PENDING)
    cart = models.ForeignKey(
        Cart, null=True, on_delete=models.SET_NULL, related_name="order"
    )
    marketing_flag = models.BooleanField(default=False)
    agreed_to_terms = models.BooleanField(default=False)
    payment_id = models.CharField(
        max_length=100, null=True, help_text="Payment ID from payment gateway or bank"
    )

    @property
    def customer_email(self):
        return self.cart.shipping_info.email

import uuid
from django.db import models

from cart.models import Cart


class Order(models.Model):
    """
    Object representing order of user.
    """

    token = models.UUIDField(primary_key=True, default=uuid.uuid4)
    create_at = models.DateTimeField(auto_now_add=True)
    paid = models.BooleanField(default=False)
    cart = models.ForeignKey(
        Cart, null=True, on_delete=models.SET_NULL, related_name="order"
    )

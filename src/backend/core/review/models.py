import uuid

from django.db import models
from product.models import Product, ProductVariant
from order.models import Order


class Review(models.Model):
    """
    Object representing review of user.
    """

    token = models.UUIDField(primary_key=True, default=uuid.uuid4)
    create_at = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(default=-1)
    comment = models.TextField()
    product_variant = models.ForeignKey(
        ProductVariant,
        null=True,
        on_delete=models.SET_NULL,
        related_name="review",
    )
    product = models.ForeignKey(
        Product, null=True, on_delete=models.SET_NULL, related_name="review"
    )
    order = models.ForeignKey(
        Order, null=True, on_delete=models.SET_NULL, related_name="review"
    )

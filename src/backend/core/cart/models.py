from django.db import models
from datetime import datetime
from country.models import (
    Country,
)
from product.models import Product, ProductVariant


class Cart(models.Model):
    """
    Object representing cart of user (either logged in on identified just by "token" which is also a primary key).
    TODO:
    - add shipping address
    - add billing address
    - add shipping method
    - add payment method
    """

    token = models.CharField(primary_key=True, max_length=20, unique=True)
    country = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)


class CartItem(models.Model):
    """
    Cart line object representing one product variant in cart.
    """

    cart = models.ForeignKey(
        Cart, null=True, on_delete=models.SET_NULL, related_name="cart_items"
    )
    product_variant = models.ForeignKey(
        ProductVariant, null=True, on_delete=models.SET_NULL
    )
    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)
    unit_price_gross = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    unit_price_net = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    quantity = models.IntegerField(default=1)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

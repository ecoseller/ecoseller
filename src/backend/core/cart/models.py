from django.db import models
from country.models import Country, Currency, VatGroup, Address
from product.models import ProductVariant
from user.models import User
from parler.models import TranslatableModel, TranslatedFields
import os


def get_shipping_method_image_path(instance, filename):
    filename, file_extension = os.path.splitext(filename)
    return f"shipping_method/{instance.id}{file_extension}"


class ShippingMethod(TranslatableModel):
    """
    Shipping method object representing one shipping method.
    So for example: general "DHL", "UPS", "FedEx" etc.
    """

    translations = TranslatedFields(
        title=models.CharField(max_length=255),
        description=models.TextField(blank=True, null=True),
    )
    image = models.FileField(
        blank=True, null=True, upload_to=get_shipping_method_image_path
    )
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.safe_translation_getter("title", any_language=True) or f"{self.id}"


class ShippingMethodCountry(models.Model):
    """
    Shipping method price object representing one shipping method price.
    So basically a binding between shipping method, country, vat group and price.

    So for example:
    - "DHL" for "Poland" with "23%" VAT for "10.00 PLN"
    - "DHL" for "Czechia" with "21%" VAT and "100 CZK"
    """

    shipping_method = models.ForeignKey(ShippingMethod, on_delete=models.CASCADE)
    payment_methods = models.ManyToManyField("PaymentMethodCountry", blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    vat_group = models.ForeignKey(VatGroup, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return (
            f"{self.shipping_method} - {self.country} - {self.vat_group} - {self.price}"
        )


def get_payment_method_image_path(instance, filename):
    filename, file_extension = os.path.splitext(filename)
    return f"payment_method/{instance.id}{file_extension}"


class PaymentMethod(TranslatableModel):
    """
    Payment method objects representing one payment method.
    so for example "cash on delivery", "bank transfer", "credit card" etc.
    """

    translations = TranslatedFields(
        title=models.CharField(max_length=255),
        description=models.TextField(blank=True, null=True),
    )
    image = models.FileField(
        upload_to=get_payment_method_image_path, blank=True, null=True
    )
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.safe_translation_getter("title", any_language=True) or f"{self.id}"


class PaymentMethodCountry(models.Model):
    """
    Payment method price object representing one payment method price.
    So basically a binding between payment method, country, vat group and price.

    So for example:
    - "cash on delivery" for "Poland" with "23%" VAT for "10.00 PLN"
    - "bank transfer" for "Czechia" with "21%" VAT and "100 CZK"
    """

    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    vat_group = models.ForeignKey(VatGroup, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return (
            f"{self.payment_method} - {self.country} - {self.vat_group} - {self.price}"
        )


class Cart(models.Model):
    """
    Object representing cart of user (either logged in on identified just by "token" which is also a primary key).
    """

    token = models.CharField(primary_key=True, max_length=20, unique=True)
    country = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    billing_address = models.ForeignKey(
        Address, null=True, on_delete=models.SET_NULL, related_name="+"
    )
    # "+" means no backwards relation
    # (see https://docs.djangoproject.com/en/dev/ref/models/fields/#django.db.models.ForeignKey.related_name)
    shipping_address = models.ForeignKey(
        Address, null=True, on_delete=models.SET_NULL, related_name="+"
    )
    payment_method_country = models.ForeignKey(PaymentMethodCountry, null=True, on_delete=models.SET_NULL,
                                               related_name="+")
    shipping_method_country = models.ForeignKey(ShippingMethodCountry, null=True, on_delete=models.SET_NULL,
                                                related_name="+")


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
    unit_price_gross = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    unit_price_net = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    quantity = models.IntegerField(default=1)

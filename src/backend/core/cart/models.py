import os
import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from parler.models import TranslatableModel, TranslatedFields

from core.safe_delete import SafeDeleteModel
from country.models import (
    Country,
    Currency,
    VatGroup,
    BillingInfo,
    ShippingInfo,
)
from product.models import ProductVariant, Product, PriceList, ProductPrice
from user.models import User


def get_shipping_method_image_path(instance, filename):
    filename, file_extension = os.path.splitext(filename)
    return f"shipping_method/{instance.id}{file_extension}"


class ShippingMethod(SafeDeleteModel, TranslatableModel):
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


class ShippingMethodCountry(SafeDeleteModel):
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

    @property
    def price_incl_vat(self):
        if not self.vat_group:
            return self.price
        return self.price * (1 + self.vat_group.rate / 100)

    @property
    def formatted_price_incl_vat(self):
        price_str = round(self.price_incl_vat, 2)
        if not self.currency:
            return price_str

        return self.currency.format_price(price_str)

    @property
    def formatted_price_without_vat(self):
        price_str = round(self.price, 2)
        if not self.currency:
            return price_str

        return self.currency.format_price(price_str)


def get_payment_method_image_path(instance, filename):
    filename, file_extension = os.path.splitext(filename)
    return f"payment_method/{instance.id}{file_extension}"


class PaymentMethod(SafeDeleteModel, TranslatableModel):
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


class PaymentMethodCountry(SafeDeleteModel):
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
    api_request = models.CharField(max_length=42, blank=True, null=True)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return (
            f"{self.payment_method} - {self.country} - {self.vat_group} - {self.price}"
        )

    @property
    def price_incl_vat(self):
        if not self.vat_group:
            return self.price
        return self.price * (1 + self.vat_group.rate / 100)

    @property
    def formatted_price_without_vat(self):
        price_str = round(self.price, 2)
        if not self.currency:
            return price_str

        return self.currency.format_price(price_str)

    @property
    def formatted_price_incl_vat(self):
        price_str = round(self.price_incl_vat, 2)
        if not self.currency:
            return price_str

        return self.currency.format_price(price_str)


class Cart(models.Model):
    """
    Object representing cart of user (either logged in on identified just by "token" which is also a primary key).
    """

    token = models.UUIDField(primary_key=True, default=uuid.uuid4)
    country = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    pricelist = models.ForeignKey(PriceList, null=True, on_delete=models.SET_NULL)

    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    billing_info = models.ForeignKey(
        BillingInfo, null=True, on_delete=models.SET_NULL, related_name="+"
    )
    # "+" means no backwards relation
    # (see https://docs.djangoproject.com/en/dev/ref/models/fields/#django.db.models.ForeignKey.related_name)
    shipping_info = models.ForeignKey(
        ShippingInfo, null=True, on_delete=models.SET_NULL, related_name="+"
    )
    payment_method_country = models.ForeignKey(
        PaymentMethodCountry, null=True, on_delete=models.SET_NULL, related_name="+"
    )
    shipping_method_country = models.ForeignKey(
        ShippingMethodCountry, null=True, on_delete=models.SET_NULL, related_name="+"
    )

    def is_valid(self):
        """
        validate cart
        * check if cart is not empty (has some cart_items)
        * check if cart_items are instock
        * check if has shipping_info
        * check if has billing_info
        * check if has payment_method_country
        * check if has shipping_method_country
        """

        items = self.cart_items.all()
        if not items or len(items) == 0:
            print("Cart is empty")
            raise "Cart is empty"
        for item in items:
            if item.product_variant.stock_quantity <= item.quantity:
                print(f"Product {item.product_variant} is out of stock")
                raise f"Product {item.product_variant} is out of stock"

        if not self.shipping_info:
            print("Shipping info is missing")
            raise "Shipping info is missing"

        if not self.billing_info:
            print("Billing info is missing")
            raise "Billing info is missing"

        if not self.payment_method_country:
            print("Payment method country is missing")
            raise "Payment method country is missing"

        if not self.shipping_method_country:
            print("Shipping method country is missing")
            raise "Shipping method country is missing"

        return True

    @property
    def total_items_price_incl_vat(self):
        """
        Get total price (unit price * quantity) of the cart items including VAT
        """
        return sum(
            [item.unit_price_incl_vat * item.quantity for item in self.cart_items.all()]
        )

    @property
    def total_items_price_incl_vat_formatted(self):
        """
        Get total price (unit price * quantity) of the cart items including VAT with currency symbol

        This price is intended to be shown to the user.
        """
        return self.pricelist.format_price(self.total_items_price_incl_vat)

    @property
    def total_price_incl_vat_formatted(self):
        """
        Get total price of the cart (sum of prices of items, payment method and shipping method) including VAT with currency symbol
        This price is intended to be shown to the user.
        """
        items_price = self.total_items_price_incl_vat
        payment_method_price = (
            self.payment_method_country.price_incl_vat
            if self.payment_method_country
            else 0
        )
        shipping_method_price = (
            self.shipping_method_country.price_incl_vat
            if self.shipping_method_country
            else 0
        )

        return self.pricelist.format_price(
            items_price + payment_method_price + shipping_method_price
        )

    @property
    def total_items_price_without_vat(self):
        """
        Get total price (unit price * quantity) of the cart items without VAT
        """
        return sum(
            [
                item.unit_price_without_vat * item.quantity
                for item in self.cart_items.all()
            ]
        )

    @property
    def total_items_price_without_vat_formatted(self):
        """
        Get total price (unit price * quantity) of the cart items (without VAT) with currency symbol

        This price is intended to be shown to the user.
        """
        return self.pricelist.format_price(self.total_items_price_without_vat)

    @property
    def price_shipping_incl_vat(self):
        return (
            self.shipping_method_country.price_incl_vat
            if self.shipping_method_country
            else 0
        )

    @property
    def price_shipping_incl_vat_formatted(self):
        return self.pricelist.format_price(self.price_shipping_incl_vat)

    @property
    def price_payment_incl_vat(self):
        return (
            self.payment_method_country.price_incl_vat
            if self.payment_method_country
            else 0
        )

    @property
    def price_payment_incl_vat_formatted(self):
        return self.pricelist.format_price(self.price_payment_incl_vat)

    @property
    def total_price_without_vat_formatted(self):
        """
        Get total price of the cart (sum of prices of items, payment method and shipping method) with currency symbol

        This price is intended to be shown to the user.
        """
        items_price = self.total_items_price_without_vat
        payment_method_price = self.price_payment_incl_vat
        shipping_method_price = self.price_shipping_incl_vat

        return self.pricelist.format_price(
            items_price + payment_method_price + shipping_method_price
        )

    def recalculate(self, pricelist: PriceList, country: Country):
        """
        Recalculate cart prices.
        """
        if (self.pricelist and self.pricelist.code == pricelist.code) and (
            self.country.code == country.code
        ):
            # if pricelist and country is the same as before, we don't need to recalculate
            return

        self.pricelist = pricelist
        self.country = country
        self.save()

        for cart_item in self.cart_items.all():
            cart_item.recalculate(pricelist, country)


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
    unit_price_without_vat = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    unit_price_incl_vat = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )  # this is supposed to be discount in percentage

    quantity = models.IntegerField(default=1)

    def _get_language(self):
        return self.cart.country.locale

    def deduct_from_inventory(self):
        """
        Deduct quantity of this cart item from inventory
        """
        self.product_variant.stock_quantity -= self.quantity
        self.product_variant.save()

    @property
    def product_variant_name(self):
        """
        Name of the product variant displayed in the cart
        """
        language = self._get_language()
        product_title = self.product.translations.get(language_code=language).title
        attribute_values = self.product_variant.get_attribute_values(language)

        return (
            f"{product_title}, {attribute_values}"
            if attribute_values
            else product_title
        )

    @property
    def product_slug(self):
        language = self._get_language()
        return self.product.translations.get(language_code=language).slug

    @property
    def primary_photo(self):
        return self.product.get_primary_photo()

    @property
    def total_price_incl_vat_formatted(self):
        """
        Get total price (unit price * quantity) including VAT of this item with currency symbol

        This price is intended to be shown to the user.
        """
        total_price = self.unit_price_incl_vat * self.quantity

        return self.cart.pricelist.format_price(total_price)

    @property
    def total_price_without_vat_formatted(self):
        """
        Get total price (unit price * quantity) without VAT of this item with currency symbol

        This price is intended to be shown to the user.
        """
        total_price = self.unit_price_without_vat * self.quantity

        return self.cart.pricelist.format_price(total_price)

    @property
    def total_price_without_vat_before_discount_formatted(self):
        """
        Get total price without VAT before discount (unit price * quantity) of this item with currency symbol

        This price is intended to be shown to the user.
        """
        if not self.discount or (self.discount == 0):
            return self.total_price_without_vat_formatted

        total_price = self.unit_price_without_vat * self.quantity
        total_price_before_discount = total_price / (1 - self.discount / 100)

        return self.cart.pricelist.format_price(total_price_before_discount)

    @property
    def unit_price_incl_vat_formatted(self):
        """
        Get unit price including VAT of this item with currency symbol

        This price is intended to be shown to the user.
        """
        return self.cart.pricelist.format_price(self.unit_price_incl_vat)

    @property
    def unit_price_without_vat_formatted(self):
        """
        Get unit price without VAT of this item with currency symbol

        This price is intended to be shown to the user.
        """
        return self.cart.pricelist.format_price(self.unit_price_without_vat)

    def recalculate(self, pricelist, country):
        # recalculate price for this cart item based on pricelist and country
        price = ProductPrice.objects.get(
            product_variant=self.product_variant, price_list=pricelist
        )
        vat = self.product.type.vat_groups.all().filter(country=country).first()
        if vat:
            vat = vat.vat
        else:
            vat = 0

        self.unit_price_without_vat = price.discounted_price
        self.unit_price_incl_vat = price.discounted_price_incl_vat(vat)
        self.save()

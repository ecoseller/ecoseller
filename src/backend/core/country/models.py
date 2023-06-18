from django.db import models
from core.safe_delete import SafeDeleteModel


class Country(SafeDeleteModel):
    """
    Country model used for front-end translations, shipping costs and product price lists.
    """

    code = models.CharField(primary_key=True, max_length=2, unique=True)
    name = models.CharField(max_length=200, blank=False)
    locale = models.CharField(max_length=2, blank=False)
    default_price_list = models.ForeignKey(
        "product.PriceList", on_delete=models.CASCADE, blank=True, null=True
    )
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"

    def get_vat_group(self, product_type):
        """
        Get VAT group of the selected product type in this country

        Returns `VatGroup` object if there's any, or `None`
        """
        vat_group = (product_type.vat_groups.all().filter(country=self)).first()

        if not vat_group:
            # if there is no vat group for the country, we take the default one
            vat_group = VatGroup.objects.filter(country=self, is_default=True).first()
        if not vat_group:
            # if there is no default vat group, we take the first one
            vat_group = VatGroup.objects.filter(country=self).first()
        if not vat_group:
            # if there is no vat group at all, we return None
            return None

        return vat_group


class Currency(SafeDeleteModel):
    """
    This model represents currency object which is used in `PriceList` model
    It helps to keep track of currency symbol and position
        * for example `BEFORE` position produces output "Kč 100" and `AFTER` "100 Kč"
    """

    SYMBOL_POSITION_CHOICES = (
        ("BEFORE", "BEFORE"),
        ("AFTER", "AFTER"),
    )

    code = models.CharField(
        max_length=3, blank=False, null=False, unique=True, primary_key=True
    )
    symbol = models.CharField(max_length=3, blank=False, null=False)
    symbol_position = models.CharField(
        max_length=6,
        blank=False,
        null=False,
        choices=SYMBOL_POSITION_CHOICES,
        default="AFTER",
    )

    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Currency"
        verbose_name_plural = "Currencies"

    def __str__(self) -> str:
        return "{} ({})".format(self.code, self.code)

    def format_price(self, price) -> str:
        """
        Formats price according to currency symbol and position
        """
        if (
            price % 1 == 0
        ):  # If it's a whole number, convert it to int, to make sure there aren't any decimal places
            price = int(price)

        price_str = f"{price:,}".replace(",", " ")  # add space between thousands

        return (
            f"{self.symbol} {price_str}"
            if self.symbol_position == "BEFORE"
            else f"{price_str} {self.symbol}"
        )


class VatGroup(SafeDeleteModel):
    """
    This model represents VAT group object which is used in `PriceList` model
    It helps to keep track of VAT group name and rate
    """

    name = models.CharField(max_length=200, blank=False, null=False)
    rate = models.DecimalField(max_digits=5, decimal_places=2, blank=False, null=False)
    country = models.ForeignKey(
        "country.Country", on_delete=models.CASCADE, blank=False, null=False
    )
    is_default = models.BooleanField(default=False)

    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "VAT Group"
        verbose_name_plural = "VAT Groups"

    # overload save method to ensure that only one default VAT group exists for each country
    def save(self, *args, **kwargs):
        if self.is_default:
            try:
                temp = VatGroup.objects.get(country=self.country, is_default=True)
                if self != temp:
                    temp.is_default = False
                    temp.save()
            except VatGroup.DoesNotExist:
                pass
        super(VatGroup, self).save(*args, **kwargs)

    def __str__(self) -> str:
        return "{} ({})".format(self.name, self.rate)


class Address(SafeDeleteModel):
    """
    Object representing address
    """

    user = models.ForeignKey(
        "user.User", on_delete=models.CASCADE, blank=True, null=True
    )
    first_name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=255)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class BillingInfo(Address):
    """
    Object representing billing info of an order
    """

    company_name = models.CharField(max_length=255, blank=True, null=True)
    company_id = models.CharField(
        max_length=255, blank=True, null=True
    )  # this field is used for company identification number (IČO)
    vat_number = models.CharField(
        max_length=255, blank=True, null=True
    )  # this field is used for VAT number (DIČ)

    class Meta:
        verbose_name = "Billing Address"
        verbose_name_plural = "Billing Addresses"


class ShippingInfo(Address):
    """
    Object representing shipping info of an order
    """

    email = models.EmailField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    additional_info = models.TextField(
        blank=True, null=True
    )  # this field is used for additional information about shipping address (e.g. floor, door code, etc.)

    class Meta:
        verbose_name = "Shipping Address"
        verbose_name_plural = "Shipping Addresses"

from django.db import models

class Country(models.Model):
    """
    Country model used for front-end translations, shipping costs and product price lists.
    """

    code = models.CharField(primary_key=True, max_length=2, unique=True)
    name = models.CharField(max_length=200, blank=False)
    locale = models.CharField(max_length=2, blank=False)
    default_price_list = models.ForeignKey('product.PriceList', on_delete=models.CASCADE, blank=True, null=True)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"

class Currency(models.Model):
    """
    This model represents currency object which is used in `PriceList` model
    It helps to keep track of currency symbol and position
        * for example `BEFORE` position produces output "Kč 100" and `AFTER` "100 Kč"
    """

    SYMBOL_POSITION_CHOICES = (
        ("BEFORE", "BEFORE"),
        ("AFTER", "AFTER"),
    )

    code = models.CharField(max_length=3, blank=False, null=False, unique=True, primary_key=True)
    symbol = models.CharField(max_length=3, blank=False, null=False)
    symbol_position = models.CharField(max_length=6, blank=False, null=False, choices=SYMBOL_POSITION_CHOICES, default="AFTER")

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
        if self.symbol_position == "BEFORE":
            return "{} {}".format(self.symbol, price)
        return "{} {}".format(price, self.symbol)



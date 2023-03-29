from django.db import models
from parler.models import TranslatableModel, TranslatedFields
from ckeditor.fields import RichTextField
from core.models import (
    SortableModel,
)
from category.models import (
    Category,
)
from country.models import (
    Currency,
)


class ProductVariant(models.Model):
    sku = models.CharField(max_length=255, blank=True, primary_key=True, unique=True)
    ean = models.CharField(max_length=13, blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)
    attributes = models.ManyToManyField("BaseAttribute", blank=True, null=True)

    def __str__(self) -> str:
        return "sku: {} ean: {}".format(self.sku, self.ean)


class Product(TranslatableModel):
    id = models.CharField(primary_key=True, max_length=20, unique=True)
    published = models.BooleanField(default=False)
    category = models.ForeignKey(
        Category, null=True, on_delete=models.SET_NULL
    )  # SET_NULL when category is deleted
    translations = TranslatedFields(
        title=models.CharField(
            max_length=200, blank=True, help_text="Product title in given language"
        ),
        meta_title=models.CharField(
            max_length=200, blank=True, help_text="SEO Meta title in given language"
        ),
        meta_description=models.TextField(
            blank=True, help_text="SEO Meta description in given language"
        ),
        short_description=models.TextField(
            blank=True, null=True, help_text="Short description in given language"
        ),
        description=RichTextField(
            blank=True,
            null=True,
            help_text="Main product description in given language",
        ),
        slug=models.SlugField(
            max_length=200, null=False, help_text="Slug in given language"
        ),
    )
    product_variants = models.ManyToManyField(
        "ProductVariant", symmetrical=False, blank=True
    )
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return "id: {} title: {}".format(self.id, self.title)

    def get_primary_photo(self):
        from .models import (
            ProductMedia,
        )

        return (
            ProductMedia.objects.filter(
                product=self,
                type=ProductMediaTypes.IMAGE,
            )
            .order_by("sort_order")
            .first()
        )


# Attributes
class AttributeType(models.Model):
    type_name = models.CharField(
        max_length=200,
        blank=False,
        null=False,
        help_text="Type name of attribute (e.g. weight, size)",
    )
    unit = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Unit of given type in which value is measured",
    )

    def __str__(self) -> str:
        return "{} ({})".format(self.type_name, self.unit)


class BaseAttribute(models.Model):
    type = models.ForeignKey(
        "AttributeType", on_delete=models.CASCADE, related_name="base_attributes"
    )
    value = models.CharField(max_length=200, blank=False, null=False)
    order = models.IntegerField(blank=True, null=True)
    ext_attributes = models.ManyToManyField("ExtensionAttribute", blank=True)

    def __str__(self) -> str:
        return "{}: {}".format(self.type.type_name, self.value)


class ExtAttributeType(models.Model):
    type_name = models.CharField(
        max_length=200,
        blank=False,
        null=False,
        help_text="Type name of attribute (e.g. weight, size)",
    )
    unit = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Unit of given type in which value is measured",
    )

    def __str__(self) -> str:
        return "{} ({})".format(self.type_name, self.unit)


class ExtensionAttribute(models.Model):
    type = models.ForeignKey("ExtAttributeType", on_delete=models.CASCADE)
    value = models.CharField(max_length=200, blank=False, null=False)
    ext_attributes = models.ManyToManyField("self", blank=True, symmetrical=False)

    def __str__(self) -> str:
        return "{}: {}".format(self.type.type_name, self.value)


# Prices
class PriceList(models.Model):
    """
    This model represents an object directly linked from `Price` models
    This should contain basic information such as:
    * some kind of identifier (e.g. code)
    * currency of pricelist
    * rounding flag
    """

    code = models.CharField(
        max_length=200, blank=False, null=False, unique=True, primary_key=True
    )
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    rounding = models.BooleanField(default=False)
    includes_vat = models.BooleanField(
        default=True
    )  # prices in pricelist are including VAT

    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return "{} ({})".format(self.code, self.currency)

    def format_price(self, price):
        """
        Formats price according to rounding and currency
        """
        price = round(price) if self.rounding else round(price, 2)
        price = f"{price:,}".replace(",", " ")
        return self.currency.format_price(price)


class ProductPrice(models.Model):
    price_list = models.ForeignKey(
        PriceList, on_delete=models.CASCADE, blank=False, null=False
    )
    product_variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="price",
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False, null=False
    )

    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return "{}: {} {}".format(
            self.product_variant, self.price, self.price_list.currency
        )

    @property
    def formatted_price(self):
        return self.price_list.format_price(self.price)


class ProductMediaTypes:
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"

    CHOICES = [
        (IMAGE, "An uploaded image or an URL to an image"),
        (VIDEO, "A URL to an external video"),
    ]


def product_media_upload_path(instance, filename):
    # create path to store product media
    # store it in MEDIA_ROOT/product_media/<product_id>/<filename>
    return "product_media/{}/{}/{}".format(
        instance.product.id, instance.type.lower(), filename
    )


class ProductMedia(SortableModel):
    """
    Model used to store images for products (high level object - not variant)
    """

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="product_media",
    )
    media = models.ImageField(
        upload_to=product_media_upload_path, blank=False, null=False
    )
    type = models.CharField(
        max_length=10,
        choices=ProductMediaTypes.CHOICES,
        default=ProductMediaTypes.IMAGE,
    )

    alt = models.CharField(max_length=128, blank=True, null=True)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self) -> str:
        return "{}: {} {}".format(self.product, self.type, self.media)

    def get_ordering_queryset(self):
        if not self.product:
            return ProductMedia.objects.none()
        return self.product.product_media.all()


class ProductVariantMedia(models.Model):
    """
    Model used to store images for product variants (low level object)
    So that we can have different images for different variants of the same product
    and resolve, for example, image for red t-shirt, blue t-shirt etc.
    """

    product_variant = models.ForeignKey(
        ProductVariant, on_delete=models.CASCADE, blank=False, null=False
    )
    media = models.ForeignKey(
        ProductMedia, on_delete=models.CASCADE, blank=False, null=False
    )

    class Meta:
        unique_together = ("product_variant", "media")

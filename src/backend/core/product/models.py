from django.db import models
from parler.models import TranslatableModel, TranslatedFields
from ckeditor.fields import RichTextField
from django_editorjs_fields import EditorJsJSONField
from api.recommender_system import RecommenderSystemApi
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
    attributes = models.ManyToManyField("BaseAttribute", blank=True)

    def __str__(self) -> str:
        return "sku: {} ean: {}".format(self.sku, self.ean)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(
            force_insert=force_insert,
            force_update=force_update,
            using=using,
            update_fields=update_fields,
        )
        data = {
            "_model_class": self.__class__.__name__,
            "sku": self.sku,
            "ean": self.ean,
            "weight": self.weight,
            "update_at": self.update_at.isoformat(),
            "create_at": self.create_at.isoformat(),
            "attributes": [attribute.id for attribute in self.attributes.all()],
        }
        RecommenderSystemApi.store_object(data=data)


class ProductType(models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)
    allowed_attribute_types = models.ManyToManyField("AttributeType", blank=True)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(
            force_insert=force_insert,
            force_update=force_update,
            using=using,
            update_fields=update_fields,
        )
        data = {
            "_model_class": self.__class__.__name__,
            "id": self.id,
            "name": self.name,
            "allowed_attribute_types": [
                type.id for type in self.allowed_attribute_types.all()
            ],
            "update_at": self.update_at.isoformat(),
            "create_at": self.create_at.isoformat(),
        }
        RecommenderSystemApi.store_object(data=data)


class Product(TranslatableModel):
    published = models.BooleanField(default=False)
    type = models.ForeignKey(
        "ProductType", on_delete=models.SET_NULL, null=True, blank=True
    )
    category = models.ForeignKey(
        Category, null=True, on_delete=models.SET_NULL, blank=True
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
        description_editorjs=EditorJsJSONField(
            blank=True,
            null=True,
            help_text="Main product description in given language in EditorJS format",
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

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(
            force_insert=force_insert,
            force_update=force_update,
            using=using,
            update_fields=update_fields,
        )
        data = {
            "_model_class": self.__class__.__name__,
            "id": self.id,
            "published": self.published,
            "type": self.type.id,
            "category": self.category.id,
            "product_translations": [
                {
                    "id": translation.id,
                    "language_code": translation.language_code,
                    "title": translation.title,
                    "meta_title": translation.meta_title,
                    "description": translation.description,
                    "meta_description": translation.meta_description,
                    "short_description": translation.short_description,
                    "slug": translation.slug,
                }
                for translation in self.translations
            ],
            "product_variants": [variant.id for variant in self.product_variants.all()],
            "update_at": self.create_at.isoformat(),
            "create_at": self.create_at.isoformat(),
        }
        RecommenderSystemApi.store_object(data=data)


# Attributes
class AttributeType(models.Model):
    type_name = models.CharField(
        max_length=200,
        help_text="Type name of attribute (e.g. weight, size)",
        blank=True,  # both blank and null must be True to allow empty string because of initial POST
        null=True,
        # blank=False,
        # null=False,
    )
    unit = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Unit of given type in which value is measured",
    )

    def __str__(self) -> str:
        return "{} ({})".format(self.type_name, self.unit)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(
            force_insert=force_insert,
            force_update=force_update,
            using=using,
            update_fields=update_fields,
        )
        data = {
            "_model_class": "AttributeType",  # Until Base and Extension attributes are joined
            "id": self.id,
            "type_name": self.type_name,
            "unit": self.unit,
        }
        RecommenderSystemApi.store_object(data=data)


class BaseAttribute(models.Model):
    type = models.ForeignKey(
        "AttributeType", on_delete=models.CASCADE, related_name="base_attributes"
    )
    value = models.CharField(
        max_length=200, blank=True, null=True
    )  # it must be set to blank=True, null=True to allow empty string because of initial POST
    order = models.IntegerField(blank=True, null=True)
    ext_attributes = models.ManyToManyField("ExtensionAttribute", blank=True)

    def __str__(self) -> str:
        return "{}: {}".format(self.type.type_name, self.value)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(
            force_insert=force_insert,
            force_update=force_update,
            using=using,
            update_fields=update_fields,
        )
        data = {
            "_model_class": "Attribute",  # Until Base and Extension attributes are joined
            "id": self.id,
            "type": self.type.id,
            "value": self.value,
            "order": self.order,
            "attributes": [attribute.id for attribute in self.ext_attributes.all()],
        }
        RecommenderSystemApi.store_object(data=data)


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

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(
            force_insert=force_insert,
            force_update=force_update,
            using=using,
            update_fields=update_fields,
        )
        data = {
            "_model_class": "AttributeType",  # Until Base and Extension attributes are joined
            "id": self.id,
            "type_name": self.type_name,
            "unit": self.unit,
        }
        RecommenderSystemApi.store_object(data=data)


class ExtensionAttribute(models.Model):
    type = models.ForeignKey("ExtAttributeType", on_delete=models.CASCADE)
    value = models.CharField(max_length=200, blank=False, null=False)
    ext_attributes = models.ManyToManyField("self", blank=True, symmetrical=False)

    def __str__(self) -> str:
        return "{}: {}".format(self.type.type_name, self.value)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(
            force_insert=force_insert,
            force_update=force_update,
            using=using,
            update_fields=update_fields,
        )
        data = {
            "_model_class": "Attribute",  # Until Base and Extension attributes are joined
            "id": self.id,
            "type": self.type.id,
            "value": self.value,
            "order": self.order,
            "attributes": [attribute.id for attribute in self.ext_attributes.all()],
        }
        RecommenderSystemApi.store_object(data=data)


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

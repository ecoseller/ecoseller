from ckeditor.fields import RichTextField
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.forms import ValidationError as FormValidationError
from django_editorjs_fields import EditorJsJSONField
from parler.models import TranslatableModel, TranslatedFields

from api.recommender_system import RecommenderSystemApi
from category.models import (
    Category,
)
from core.models import (
    SortableModel,
)
from core.safe_delete import SafeDeleteModel
from country.models import Currency, VatGroup


class ProductVariant(SafeDeleteModel):
    sku = models.CharField(max_length=255, blank=True, primary_key=True, unique=True)
    ean = models.CharField(max_length=13, blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stock_quantity = models.IntegerField(default=0)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)
    attributes = models.ManyToManyField("BaseAttribute", blank=True)

    def __str__(self) -> str:
        return "sku: {} ean: {}".format(self.sku, self.ean)

    def get_attribute_values(self, locale):
        variant_attributes = [
            attr.to_locale_string(locale) for attr in self.attributes.all()
        ]
        return ", ".join(variant_attributes)

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
            "weight": float(self.weight) if self.weight is not None else None,
            "stock_quantity": self.stock_quantity,
            "recommendation_weight": 1.0,
            "update_at": self.update_at.isoformat(),
            "create_at": self.create_at.isoformat(),
            "attributes": [attribute.id for attribute in self.attributes.all()],
        }
        RecommenderSystemApi.store_object(data=data)


class ProductType(SafeDeleteModel):
    name = models.CharField(max_length=200, blank=True, null=True)
    allowed_attribute_types = models.ManyToManyField("AttributeType", blank=True)
    vat_groups = models.ManyToManyField(
        VatGroup, blank=True, related_name="product_types"
    )
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
            "attribute_types": [type.id for type in self.allowed_attribute_types.all()],
            "products": [product.id for product in self.product_set.all()],
            "update_at": self.update_at.isoformat(),
            "create_at": self.create_at.isoformat(),
        }
        RecommenderSystemApi.store_object(data=data)


class Product(SafeDeleteModel, TranslatableModel):
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

    def get_attribute_list(self, language_code):
        attributes = []
        for variant in self.product_variants.all():
            for attribute in variant.attributes.all():
                attributes.append(
                    attribute.safe_translation_getter(
                        "name", language_code=language_code
                    )
                    or attribute.value
                )
        return attributes

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
            "type": self.type.id if self.type is not None else None,
            "category": self.category.id if self.category is not None else None,
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
                for translation in self.translations.all()
            ],
            "product_variants": [
                variant.sku for variant in self.product_variants.all()
            ],
            "update_at": self.create_at.isoformat(),
            "create_at": self.create_at.isoformat(),
        }
        RecommenderSystemApi.store_object(data=data)


# Attributes


class AttributeTypeValueType:
    """
    Enum class for attribute type value types
    * TEXT - value is represented as a text (e.g. "red", "XL"), so it can't be sorted
    * INTEGER - value is represented as an integer (e.g. 10, 20), so it can be sorted
    * DECIMAL - value is represented as a decimal (e.g. 10.5, 20.5), so it can be sorted
    """

    TEXT = "TEXT"
    INTEGER = "INTEGER"
    DECIMAL = "DECIMAL"

    CHOICES = [
        (TEXT, "Value is represented as a text"),
        (INTEGER, "Value is represented as an integer"),
        (DECIMAL, "Value is represented as a decimal"),
    ]


class AttributeType(SafeDeleteModel, TranslatableModel, models.Model):
    type_name = models.CharField(
        max_length=200,
        help_text="Type name of attribute (e.g. weight, size)",
        blank=True,  # both blank and null must be True to allow empty string because of initial POST
        null=True,
        # blank=False,
        # null=False,
    )
    translations = TranslatedFields(
        name=models.CharField(
            max_length=200, blank=True, help_text="Attribute type in given language"
        ),
    )
    unit = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Unit of given type in which value is measured",
    )
    value_type = models.CharField(
        max_length=10,
        choices=AttributeTypeValueType.CHOICES,
        default=AttributeTypeValueType.TEXT,
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
            "type": "CATEGORICAL",
            "type_name": self.type_name,
            "unit": self.unit,
        }
        RecommenderSystemApi.store_object(data=data)


# class TranslatableAttributeType(TranslatableModel, AttributeType):
#     # https://django-parler.readthedocs.io/en/stable/advanced/existing.html
#     class Meta:
#         proxy = True

#     translations = TranslatedFields(
#         name=models.CharField(
#             max_length=200, blank=True, help_text="Attribute type in given language"
#         ),
#     )


class BaseAttribute(SafeDeleteModel, TranslatableModel):
    type = models.ForeignKey(
        "AttributeType", on_delete=models.CASCADE, related_name="base_attributes"
    )
    value = models.CharField(
        max_length=200, blank=True, null=True
    )  # it must be set to blank=True, null=True to allow empty string because of initial POST
    translations = TranslatedFields(
        name=models.CharField(
            max_length=200,
            blank=True,
            help_text="Base Attribute in given language",
            null=True,
        ),
    )
    order = models.IntegerField(blank=True, null=True)
    ext_attributes = models.ManyToManyField("ExtensionAttribute", blank=True)

    def __str__(self) -> str:
        attr_with_value = f"{self.type.type_name}: {self.value}"
        if self.type.unit:
            attr_with_value += self.type.unit
        return attr_with_value

    def to_locale_string(self, locale):
        localized_attribute_name = self.type.get_translation(language_code=locale).name
        localized_attribute_value = (
            self.get_translation(language_code=locale).name
            if self.type.value_type == AttributeTypeValueType.TEXT
            else self.value
        )

        attr_with_value = f"{localized_attribute_name}: {localized_attribute_value}"
        if self.type.unit:
            attr_with_value += self.type.unit
        return attr_with_value

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
            "raw_value": self.value,
            "order": self.order,
            "ext_attributes": [attribute.id for attribute in self.ext_attributes.all()],
        }
        RecommenderSystemApi.store_object(data=data)


# class TranslatableBaseAttribute(TranslatableModel, BaseAttribute):
#     # https://django-parler.readthedocs.io/en/stable/advanced/existing.html
#     class Meta:
#         proxy = True

#     translations = TranslatedFields(
#         name=models.CharField(
#             max_length=200, blank=True, help_text="Base Attribute in given language"
#         ),
#     )


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
            "type": "CATEGORICAL",
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
            "raw_value": self.value,
            "order": self.order,
            "ext_attributes": [attribute.id for attribute in self.ext_attributes.all()],
        }
        RecommenderSystemApi.store_object(data=data)


# Prices
class PriceList(SafeDeleteModel, models.Model):
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
    is_default = models.BooleanField(default=False)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    rounding = models.BooleanField(default=False)

    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    # custom save method which will ensure that only one pricelist is default
    def save(self, *args, **kwargs):
        if self.is_default and len(PriceList.objects.filter(is_default=True)) > 0:
            raise FormValidationError("Only one pricelist can be default")

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return "{} ({})".format(self.code, self.currency)

    def format_price(self, price):
        """
        Formats price according to rounding and currency
        """
        price = round(price) if self.rounding else round(price, 2)
        return self.currency.format_price(price)


class ProductPrice(SafeDeleteModel):
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
    )  # this is supposed to be price without VAT
    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )  # this is supposed to be discount in percentage

    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return "{}: {} {}".format(
            self.product_variant, self.price, self.price_list.currency
        )

    @property
    def formatted_price(self):
        return self.price_list.format_price(self.price)

    @property
    def discounted_price(self):
        """
        Returns discounted price without VAT

        If there's no discount, return base price.
        """
        if self.discount is not None:
            return self.price * (1 - self.discount / 100)
        else:
            return self.price

    def format_price(self, price):
        return self.price_list.format_price(price)

    def price_incl_vat(self, vat):
        return self.price * (1 + vat / 100)

    def discounted_price_incl_vat(self, vat):
        """
        Returns discounted price including VAT

        If there's no discount, return base price including VAT
        """
        if self.discount is not None:
            return self.price_incl_vat(vat) * (1 - self.discount / 100)
        else:
            return self.price_incl_vat(vat)

    @property
    def is_discounted(self):
        return self.discount is not None

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
            "price_list_code": self.price_list.code,
            "product_variant_sku": self.product_variant.sku
            if self.product_variant is not None
            else None,
            "price": float(self.price),
            "update_at": self.update_at.isoformat(),
            "create_at": self.create_at.isoformat(),
        }
        RecommenderSystemApi.store_object(data=data)


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


class ProductMedia(SafeDeleteModel, SortableModel):
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


class ProductVariantMedia(SafeDeleteModel):
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

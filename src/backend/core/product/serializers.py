from core.mixins import (
    TranslatedSerializerMixin,
)
from rest_framework.serializers import (
    ModelSerializer,
)
from parler_rest.serializers import (TranslatableModelSerializer, TranslatedFieldsField, )

from category.serializers import (
    CategorySerializer,
)
from country.serializers import (
    CurrencySerializer,
)

from product.models import (
    Product,
    ProductVariant,
    ProductImage,
    ProductPrice,
    #ProductMedia
)

"""
Common serializers
"""
class ProductMediaSerializer(ModelSerializer):
    class Meta:
        model = ProductImage
        order_by = [
        ]
        fields = ("id", "image", "alt",)

class PriceListSerializer(ModelSerializer):
    currency = CurrencySerializer(read_only=True, many=False)
    class Meta:
        model = ProductPrice
        fields = ("id", "name", "currency", "rounding", "includes_vat", "update_at", "create_at",)


class ProductPriceSerializer(ModelSerializer):
    price_list = PriceListSerializer(read_only=True, many=False)
    
    class Meta:
        model = ProductPrice
        fields = (
            "id",
            "price",
            "currency",
            "price_list",
        )    

"""
Dashboard serializers
"""
class ProductVariantSerializer(ModelSerializer):
    """
    Product Variant Serializer (see product/models.py)
    returns only basic variant fields such as SKU, EAN, weight
    TODO: price, stock, attributes
    """
    price = ProductPriceSerializer(many=True, read_only=True)
    class Meta:
        model = ProductVariant
        fields = (
            "sku",
            "ean",
            "weight",
            "price"
        )


class ProductDashboardListSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Product Dashboard Serializer (see product/models.py)
    returns product fields for dashboard
    """

    primary_image = ProductMediaSerializer(read_only=True, many=False)

    class Meta:
        model = Product
        fields = (
            "id",
            "title",
            "slug",
            "primary_image",
            "published",
            "create_at",
            "update_at",
        )

class ProductDashboardDetailSerializer(TranslatableModelSerializer, ModelSerializer):
    translations = TranslatedFieldsField(shared_model=Product)
    product_variant = ProductVariantSerializer(many=True, read_only=True)
    # media = ProductMediaSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = (
            "id",
            "published",
            "translations", # translations object with all translations
            "category", # serialized as id
            "product_variant", 
            "update_at",
            "create_at",
        )


class ProductSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Basic Product model serializer (see product/models.py)
    retrieving all fields defined in the model with nested list of product variants
    and category.
    Only one translation is returned (see TranslatedSerializerMixin)
    """

    product_variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "published",
            "category",
            "title",
            "meta_title",
            "meta_description",
            "short_description",
            "description",
            "slug",
            "product_variants",
        )

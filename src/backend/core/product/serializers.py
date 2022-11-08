from core.mixins import (TranslatedSerializerMixin, )
from rest_framework.serializers import (ModelSerializer, )
from category.serializers import (CategorySerializer, )
from product.models import (
    Product,
    ProductVariant,
)

class ProductVarinatSerializer(ModelSerializer):
    """
    Product Variant Serializer (see product/models.py)
    returns only basic variant fields such as SKU, EAN, weight
    TODO: price, stock, attributes
    """
    class Meta:
        model = ProductVariant
        fields = (
            'sku',
            'ean',
            'weight',
        )

class ProductSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Basic Product model serializer (see product/models.py)
    retrieving all fields defined in the model with nested list of product variants
    and category.
    Only one translation is returned (see TranslatedSerializerMixin)
    """
    product_variants = ProductVarinatSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    class Meta:
        model = Product
        fields = (
            'id',
            'published',
            'category',
            'title',
            'meta_title',
            'meta_description',
            'short_description',
            'description',
            'slug',
            'product_variants',
        )
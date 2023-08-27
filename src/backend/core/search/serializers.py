from product.models import Product
from product.serializers import ProductStorefrontListSerializer


class ProductSuggestionsSerializer(ProductStorefrontListSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "slug",
            "primary_image",
            "price",
        ]

from product.models import Product
from product.serializers import ProductStorefrontListSerializer


class ProductSuggestionsSerializer(ProductStorefrontListSerializer):
    class Meta:
        model = Product
        fields = [  # TODO: this needs some tunning after we have category page :)
            "id",
            "title",
            "slug",
            "primary_image",
            "price",
        ]

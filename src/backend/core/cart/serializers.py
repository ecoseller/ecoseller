from rest_framework.serializers import (
    ModelSerializer,
)
from cart.models import (
    Cart,
    CartItem,
)
from country.serializers import (
    CountrySerializer,
)


class CartItemSerializer(ModelSerializer):
    """
    Serializer of one line in cart (see cart/models.py)
    Contains both product and product variant and numeric price and quantity.
    TODO: add product and product variant serializer (or just save product name and variant attributes as a string?)
    """

    class Meta:
        model = CartItem
        fields = (
            "id",
            "product_variant",
            "product",
            "unit_price_gross",
            "unit_price_net",
            "quantity",
            "update_at",
            "create_at",
        )


class CartSerializer(ModelSerializer):
    """
    Large serializer of cart (see cart/models.py)
    Contains list of cart items, country and token defining the cart itself.
    """

    cart_items = CartItemSerializer(many=True, read_only=True)
    country = CountrySerializer(read_only=True)

    class Meta:
        model = Cart
        fields = (
            "token",
            "country",
            "update_at",
            "create_at",
            "cart_items",
        )

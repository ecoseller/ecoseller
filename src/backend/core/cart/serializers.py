from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    CharField,
    IntegerField,
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
            "product_variant",
            "unit_price_gross",
            "unit_price_net",
            "quantity",
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


class CartItemUpdateSerializer(Serializer):
    """
    Serializer used for updating cart items
    """

    sku = CharField()
    quantity = IntegerField(min_value=1)

    def create(self, validated_data):
        return CartItemUpdateData(validated_data["sku"], validated_data["quantity"])


class CartItemUpdateData:
    def __init__(self, sku, quantity):
        self.sku, self.quantity = sku, quantity

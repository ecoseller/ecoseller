import filetype
from drf_extra_fields.fields import Base64FileField
from parler_rest.serializers import (
    TranslatableModelSerializer,
    TranslatedFieldsField,
)
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    CharField,
    IntegerField,
    PrimaryKeyRelatedField,
)

from cart.models import (
    Cart,
    CartItem,
    ShippingMethod,
    ShippingMethodCountry,
    PaymentMethod,
    PaymentMethodCountry,
)
from core.mixins import (
    TranslatedSerializerMixin,
)
from country.models import (
    Country,
)
from product.models import (
    Product,
)
from product.serializers import (
    PriceList,
)


class FileImageField(Base64FileField):
    ALLOWED_TYPES = ["png", "jpg", "jpeg", "gif", "svg"]

    def get_file_extension(self, filename, decoded_file):
        kind = filetype.guess(decoded_file)
        return kind.extension


class CartItemDetailSerializer(ModelSerializer):
    """
    Serializer of one line in cart (see cart/models.py)
    Contains both product and product variant id and numeric price and quantity.
    """

    class Meta:
        model = CartItem
        fields = (
            "product",
            "product_variant",
            "product_variant_name",
            "unit_price_gross",
            "unit_price_net",
            "quantity",
            "discount",
        )


class CartTokenSerializer(ModelSerializer):
    """
    Serializer for cart's token
    """

    class Meta:
        model = Cart
        fields = ("token",)


class CartSerializer(ModelSerializer):
    """
    Serializer of cart (see cart/models.py)
    Contains list of cart items, currency symbol and symbol position
    """

    cart_items = CartItemDetailSerializer(many=True, read_only=True)

    # country = CountrySerializer(read_only=True)
    # shipping_info_id = PrimaryKeyRelatedField(
    #     queryset=ShippingInfo.objects.all(),
    #     source="shipping_info",
    #     write_only=True,
    #     required=False,
    # )
    # billing_info_id = PrimaryKeyRelatedField(
    #     queryset=BillingInfo.objects.all(),
    #     source="billing_info",
    #     write_only=True,
    #     required=False,
    # )
    # shipping_info = ShippingInfoSerializer(read_only=True)
    # billing_info = BillingInfoSerializer(read_only=True)
    # pricelist = PriceListSerializer(read_only=True, many=False)

    currency_symbol = SerializerMethodField()
    symbol_position = SerializerMethodField()

    class Meta:
        model = Cart
        fields = ("cart_items", "update_at", "currency_symbol", "symbol_position")

    def get_currency_symbol(self, obj):
        return obj.pricelist.currency.symbol

    def get_symbol_position(self, obj):
        return obj.pricelist.currency.symbol_position


class CartItemAddSerializer(Serializer):
    """
    Serializer used for adding cart items
    """

    sku = CharField()
    quantity = IntegerField(min_value=1)
    product = PrimaryKeyRelatedField(queryset=Product.objects.all())
    pricelist = PrimaryKeyRelatedField(queryset=PriceList.objects.all())
    country = PrimaryKeyRelatedField(queryset=Country.objects.all())

    def create(self, validated_data):
        return CartItemAddData(
            validated_data["sku"],
            validated_data["quantity"],
            validated_data["product"],
            validated_data["pricelist"],
            validated_data["country"],
        )


class CartItemAddData:
    def __init__(self, sku, quantity, product, pricelist, country):
        self.sku, self.quantity, self.product, self.pricelist, self.country = (
            sku,
            quantity,
            product,
            pricelist,
            country,
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
        self.sku, self.quantity = (sku, quantity)


class ShippingMethodSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Serializer of shipping method (see cart/models.py)
    Contains name, description in all languages and image.
    """

    class Meta:
        model = ShippingMethod
        fields = (
            "id",
            "title",
            "image",
            "create_at",
            "update_at",
        )


class ShippingMethodDetailSerializer(TranslatableModelSerializer, ModelSerializer):
    """
    Serializer of shipping method (see cart/models.py)
    Contains name, description in all languages and image.
    """

    translations = TranslatedFieldsField(shared_model=ShippingMethod, required=False)
    image = FileImageField(required=False)

    class Meta:
        model = ShippingMethod
        fields = (
            "id",
            "translations",
            "image",
            "create_at",
            "update_at",
        )


class ShippingMethodCountrySerializer(ModelSerializer):
    """
    Serializer of shipping method country (see cart/models.py)
    Contains shipping method and country.
    """

    # shipping_method = ShippingMethodSerializer(read_only=True)

    class Meta:
        model = ShippingMethodCountry
        fields = (
            "id",
            "shipping_method",
            "country",
            "vat_group",
            "currency",
            "payment_methods",
            "price",
            "is_active",
            "update_at",
            "create_at",
        )


class PaymentMethodSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Serializer of payment method (see cart/models.py)
    Contains name, price and description in all languages.
    """

    class Meta:
        model = PaymentMethod
        fields = (
            "id",
            "title",
            "image",
            "create_at",
            "update_at",
        )


class PaymentMethodDetailSerializer(TranslatableModelSerializer, ModelSerializer):
    """
    Serializer of payment method (see cart/models.py)
    Contains name, price and description in all languages.
    """

    translations = TranslatedFieldsField(shared_model=PaymentMethod, required=False)
    image = FileImageField(required=False)

    class Meta:
        model = PaymentMethod
        fields = (
            "id",
            "translations",
            "image",
        )


class PaymentMethodCountrySerializer(ModelSerializer):
    """
    Serializer of payment method country (see cart/models.py)
    Contains payment method and country.
    """

    # payment_method = PaymentMethodSerializer(read_only=True)

    class Meta:
        model = PaymentMethodCountry
        fields = (
            "id",
            "payment_method",
            "country",
            "vat_group",
            "currency",
            "price",
            "is_active",
            "update_at",
            "create_at",
        )


class PaymentMethodCountryFullSerializer(ModelSerializer):
    """
    Serializer of payment method country (see cart/models.py)
    Contains payment method and country.
    """

    payment_method = PaymentMethodSerializer(read_only=True)

    class Meta:
        model = PaymentMethodCountry
        fields = (
            "id",
            "payment_method",
            "country",
            "vat_group",
            "currency",
            "price",
            "is_active",
            "update_at",
            "create_at",
        )

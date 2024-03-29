import filetype
from drf_extra_fields.fields import Base64FileField
from parler_rest.serializers import (
    TranslatableModelSerializer,
    TranslatedFieldsField,
)
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
    ProductMediaBaseSerializer,
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

    primary_image = ProductMediaBaseSerializer(
        read_only=True, many=False, source="primary_photo"
    )
    product_id = IntegerField(source="product.id")
    product_variant_sku = CharField(source="product_variant.sku")

    class Meta:
        model = CartItem
        fields = (
            "id",
            "product_id",
            "product_variant_sku",
            "product_slug",
            "product_variant_name",
            "unit_price_without_vat",
            "unit_price_incl_vat",
            "total_price_incl_vat_formatted",
            "total_price_without_vat_formatted",
            "unit_price_incl_vat_formatted",
            "unit_price_without_vat_formatted",
            "quantity",
            "discount",
            "primary_image",
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

    class Meta:
        model = Cart
        fields = (
            "token",
            "cart_items",
            "update_at",
            "total_items_price_incl_vat_formatted",
            "total_items_price_without_vat_formatted",
            "total_price_incl_vat_formatted",
            "total_price_without_vat_formatted",
            "shipping_method_country",
            "payment_method_country",
        )


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

    class Meta:
        model = PaymentMethodCountry
        fields = (
            "id",
            "payment_method",
            "country",
            "vat_group",
            "currency",
            "price",
            "api_request",
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
            "api_request",
            "is_active",
            "update_at",
            "create_at",
        )


class CartPaymentMethodSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Serializer used for serializing shipping methods in step 2 of the order
    """

    class Meta:
        model = PaymentMethod
        fields = (
            "title",
            "description",
            "image",
        )


class CartShippingMethodSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Serializer used for serializing shipping methods in step 2 of the order
    """

    class Meta:
        model = ShippingMethod
        fields = (
            "title",
            "description",
            "image",
        )


class CartPaymentMethodCountrySerializer(ModelSerializer):
    """
    Serializer used for serializing payment methods in step 2 of the the order nested
    into CartShippingMethodCountrySerializer
    """

    payment_method = CartPaymentMethodSerializer(read_only=True)
    price_incl_vat = CharField(source="formatted_price_incl_vat")
    price_without_vat = CharField(source="formatted_price_without_vat")

    class Meta:
        model = PaymentMethodCountry
        fields = ("id", "payment_method", "price_incl_vat", "price_without_vat")


class CartShippingMethodCountryBaseSerializer(ModelSerializer):
    """
    Serializer used for serializing shipping method country
    """

    shipping_method = CartShippingMethodSerializer(read_only=True)
    price_incl_vat = CharField(source="formatted_price_incl_vat")
    price_without_vat = CharField(source="formatted_price_without_vat")

    class Meta:
        model = ShippingMethodCountry
        fields = ("id", "shipping_method", "price_incl_vat", "price_without_vat")


class CartShippingMethodCountrySerializer(CartShippingMethodCountryBaseSerializer):
    """
    Serializer used for serializing shipping methods in step 2 of the order
    with nested shipping methods countries
    """

    payment_methods = CartPaymentMethodCountrySerializer(many=True, read_only=True)

    class Meta:
        model = ShippingMethodCountry
        fields = CartShippingMethodCountryBaseSerializer.Meta.fields + (
            "payment_methods",
        )


class CartDetailSerializer(ModelSerializer):
    class Meta:
        model = Cart
        fields = (
            "token",
            "user",
            "shipping_method_country",
            "payment_method_country",
            "country",
            "pricelist",
        )

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
from country.models import (
    ShippingInfo,
    BillingInfo,
)
from country.serializers import (
    CountrySerializer,
    ShippingInfoSerializer,
    BillingInfoSerializer,
)
from product.models import (
    Product,
)
from product.serializers import (
    ProductCartSerializer,
    ProductVariantCartSerializer,
    PriceList,
)


class FileImageField(Base64FileField):
    ALLOWED_TYPES = ["png", "jpg", "jpeg", "gif", "svg"]

    def get_file_extension(self, filename, decoded_file):
        kind = filetype.guess(decoded_file)
        return kind.extension


class CartItemSerializer(ModelSerializer):
    """
    Serializer of one line in cart (see cart/models.py)
    Contains both product and product variant and numeric price and quantity.
    TODO: add product and product variant serializer (or just save product name and variant attributes as a string?)
    """

    product = ProductCartSerializer(read_only=True)
    product_variant = ProductVariantCartSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = (
            "product_variant",
            "product",
            "unit_price_gross",
            "unit_price_net",
            "discount",
            "quantity",
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
    Large serializer of cart (see cart/models.py)
    Contains list of cart items, country and token defining the cart itself.
    """

    cart_items = CartItemSerializer(many=True, read_only=True)
    country = CountrySerializer(read_only=True)
    shipping_info_id = PrimaryKeyRelatedField(
        queryset=ShippingInfo.objects.all(),
        source="shipping_info",
        write_only=True,
        required=False,
    )
    billing_info_id = PrimaryKeyRelatedField(
        queryset=BillingInfo.objects.all(),
        source="billing_info",
        write_only=True,
        required=False,
    )
    shipping_info = ShippingInfoSerializer(read_only=True)
    billing_info = BillingInfoSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = (
            "token",
            "country",
            "update_at",
            "create_at",
            "cart_items",
            "shipping_info_id",
            "billing_info_id",
            "shipping_info",
            "billing_info",
        )


class CartItemUpdateSerializer(Serializer):
    """
    Serializer used for updating cart items
    """

    sku = CharField()
    quantity = IntegerField(min_value=1)
    product = PrimaryKeyRelatedField(queryset=Product.objects.all())
    pricelist = PrimaryKeyRelatedField(queryset=PriceList.objects.all())
    country = PrimaryKeyRelatedField(queryset=Country.objects.all())

    def create(self, validated_data):
        return CartItemUpdateData(
            validated_data["sku"],
            validated_data["quantity"],
            validated_data["product"],
            validated_data["pricelist"],
            validated_data["country"],
        )


class CartItemUpdateData:
    def __init__(self, sku, quantity, product, pricelist, country):
        self.sku, self.quantity, self.product, self.pricelist, self.country = (
            sku,
            quantity,
            product,
            pricelist,
            country,
        )


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

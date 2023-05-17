from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
)

from country.models import (
    Country,
    Currency,
    VatGroup,
    Address,
    ShippingInfo,
    BillingInfo,
)
from user.models import User


class VatGroupSerializer(ModelSerializer):
    """
    Basic VatGroup model serializer (see country/models.py)
    """

    class Meta:
        model = VatGroup
        fields = (
            "id",
            "name",
            "rate",
            "is_default",
            "country",
        )


class CurrencySerializer(ModelSerializer):
    """
    Basic Currency model serializer (see currency/models.py)
    """

    class Meta:
        model = Currency
        fields = (
            "code",
            "symbol",
            "symbol_position",
        )


class CountrySerializer(ModelSerializer):
    """
    Basic Country model serializer (see country/models.py)
    """

    class Meta:
        model = Country
        fields = (
            "code",
            "name",
            "locale",
            "default_price_list",
            "update_at",
            "create_at",
        )


"""
Address serializers
"""


class AddressSerializer(ModelSerializer):
    """
    Address serializer that serializes all fields
    """

    class Meta:
        model = Address
        fields = "__all__"


class ShippingAddressSerializer(ModelSerializer):
    """
    ShippingAddress serializer that serializes all fields
    """

    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = ShippingInfo
        fields = "__all__"


class BillingAddressSerializer(ModelSerializer):
    """
    BillingAddress serializer that serializes all fields
    """

    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = BillingInfo
        fields = "__all__"

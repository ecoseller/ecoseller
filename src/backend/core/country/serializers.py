from rest_framework.serializers import (
    ModelSerializer,
)
from country.models import Country, Currency, VatGroup, Address


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


class AddressSerializer(ModelSerializer):
    """
    Address serializer that serializes all fields
    """

    class Meta:
        model = Address
        fields = "__all__"

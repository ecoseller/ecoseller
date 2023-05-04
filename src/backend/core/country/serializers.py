from rest_framework.serializers import (
    ModelSerializer,
)
from country.models import Country, Currency, VatGroup


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
        )

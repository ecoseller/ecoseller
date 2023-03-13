from rest_framework.serializers import (
    ModelSerializer,
)
from country.models import (
    Country,
    Currency,
)


class CurrencySerializer(ModelSerializer):
    """
    Basic Currency model serializer (see currency/models.py)
    """

    class Meta:
        model = Currency
        fields = (
            "code",
            "name",
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

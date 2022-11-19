from rest_framework.serializers import (
    ModelSerializer,
)
from country.models import (
    Country,
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

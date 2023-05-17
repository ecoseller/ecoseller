from django.conf import settings
from rest_framework import permissions
from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Country,
    Currency,
    VatGroup,
    ShippingInfo,
    BillingInfo,
)
from .serializers import (
    CountrySerializer,
    CurrencySerializer,
    VatGroupSerializer,
    ShippingInfoSerializer,
    BillingInfoSerializer,
)

DEFAULT_LANGUAGE_CODE = settings.PARLER_DEFAULT_LANGUAGE_CODE
LANGUAGES = settings.PARLER_LANGUAGES[None]
# from parler.utils.conf import LanguagesSetting


"""
Country views
"""


class CountryListView(ListCreateAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = CountrySerializer

    def get_queryset(self):
        return Country.objects.all()


class CountryDetailView(RetrieveUpdateDestroyAPIView):
    """
    Detail of country
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []

    serializer_class = CountrySerializer
    lookup_field = "code"
    lookup_url_kwarg = "code"

    def get_queryset(self):
        return Country.objects.all()


"""
Language views
"""


class LanguagesView(APIView):
    """
    List all products for dashboard
    """

    # TODO: add permissions for dashboard views (only for staff) <- testing purposes
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        langs = [
            {
                "code": lang["code"],
                "default": lang["code"] == DEFAULT_LANGUAGE_CODE,
            }
            for lang in LANGUAGES
        ]
        print(LANGUAGES)
        return Response(langs, status=200)


class CurrencyListView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "POST", "PUT", "DELETE"]
    authentication_classes = []
    serializer_class = CurrencySerializer

    def get_queryset(self):
        return Currency.objects.all()

    def get(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CurrencyDetailView(RetrieveUpdateDestroyAPIView):
    """
    List all products for dashboard
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "POST", "PUT", "DELETE"]
    authentication_classes = []
    serializer_class = CurrencySerializer
    lookup_field = "code"
    lookup_url_kwarg = "code"

    def get_queryset(self):
        return Currency.objects.all()


"""
Vat group views
"""


class VatGroupListView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = VatGroupSerializer

    def get_queryset(self):
        return VatGroup.objects.all()

    def get(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class VatGroupDetailView(RetrieveUpdateDestroyAPIView):
    """
    List all products for dashboard
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []
    serializer_class = VatGroupSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return VatGroup.objects.all()


"""
Address views
"""


class ShippingAddressDetailView(RetrieveUpdateDestroyAPIView):
    """
    Detail of shipping address
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []
    serializer_class = ShippingInfoSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return ShippingInfo.objects.all()


class BillingAddressDetailView(RetrieveUpdateDestroyAPIView):
    """
    Detail of billing address
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []
    serializer_class = BillingInfoSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return BillingInfo.objects.all()

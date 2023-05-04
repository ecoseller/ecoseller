from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import permissions
from django.conf import settings

from .models import (
    Country,
    Currency,
)
from .serializers import (
    CountrySerializer,
    CurrencySerializer,
)

from rest_framework.generics import RetrieveUpdateDestroyAPIView


DEFAULT_LANGUAGE_CODE = settings.PARLER_DEFAULT_LANGUAGE_CODE
LANGUAGES = settings.PARLER_LANGUAGES[None]
# from parler.utils.conf import LanguagesSetting


"""
Country views
"""


class CountryListView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = CountrySerializer

    def get_queryset(self):
        return Country.objects.all()

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

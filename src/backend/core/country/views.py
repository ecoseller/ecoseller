from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.conf import settings

from .models import (
    Currency,
)
from .serializers import (
    CurrencySerializer,
)


DEFAULT_LANGUAGE_CODE = settings.PARLER_DEFAULT_LANGUAGE_CODE
LANGUAGES = settings.PARLER_LANGUAGES[None]
# from parler.utils.conf import LanguagesSetting


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


class CurrencyView(APIView):
    """
    List all products for dashboard
    """

    # TODO: add permissions for dashboard views (only for staff) <- testing purposes
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        qs = Currency.objects.all()
        serializer = CurrencySerializer(qs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = CurrencySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, code):
        try:
            currency = Currency.objects.get(code=code)
            serializer = CurrencySerializer(currency, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Currency.DoesNotExist:
            return Response(status=404)

    def delete(self, request, code):
        try:
            currency = Currency.objects.get(code=code)
            currency.delete()
            return Response(status=204)
        except Currency.DoesNotExist:
            return Response(status=404)

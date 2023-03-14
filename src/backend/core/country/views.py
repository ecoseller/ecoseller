from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.conf import settings

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

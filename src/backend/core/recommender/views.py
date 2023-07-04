from enum import Enum, EnumMeta
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions


class EnumMeta(EnumMeta):
    def __contains__(cls, item):
        return isinstance(item, cls) or item in [
            v.value for v in cls.__members__.values()
        ]


class RSEvent(Enum, EnumMeta):
    PRODUCT_VIEW = "product_view"
    PRODUCT_ADD_TO_CART = "product_add_to_cart"
    PURCHASE = "purchase"
    REVIEW = "review"


class RSSituation(Enum, EnumMeta):
    PRODUCT = "product"
    CART = "cart"
    HOMEPAGE = "homepage"
    CATEGORY = "category"


class RecommenderSystemEventView(APIView):
    allowed_methods = ["POST"]
    permission_classes = (permissions.AllowAny,)

    def post(self, request, event):
        if event not in RSEvent:
            return Response({"message": "Unknown event!"}, status=404)
        return Response(status=201)


class RecommenderSystemRecommendProductsView(APIView):
    allowed_methods = ["GET"]
    permission_classes = (permissions.AllowAny,)

    def get(self, request, situation):
        if situation not in RSSituation:
            return Response({"message": "Unknown RS situation!"}, status=404)
        return Response(status=200)

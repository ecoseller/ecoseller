from enum import Enum, EnumMeta
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions

from api.recommender_system import RecommenderSystemApi


class EnumMeta(EnumMeta):
    def __contains__(cls, item):
        return isinstance(item, cls) or item in [
            v.value for v in cls.__members__.values()
        ]


class RSEvent(Enum, metaclass=EnumMeta):
    PRODUCT_DETAIL_ENTER = "PRODUCT_DETAIL_ENTER"
    PRODUCT_DETAIL_LEAVE = "PRODUCT_DETAIL_LEAVE"
    PRODUCT_ADD_TO_CART = "PRODUCT_ADD_TO_CART"
    RECOMMENDATION_VIEW = "RECOMMENDATION_VIEW"
    ORDER = "ORDER"


class RSSituation(Enum, metaclass=EnumMeta):
    PRODUCT_DETAIL = "PRODUCT_DETAIL"
    CART = "CART"
    HOMEPAGE = "HOMEPAGE"
    CATEGORY_LIST = "CATEGORY_LIST"


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


class RecommenderSystemDashboardView(APIView):
    allowed_methods = ["GET"]
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        data = RecommenderSystemApi.get_dashboard(
            date_from=request.query_params["date_from"],
            date_to=request.query_params["date_to"],
        )
        return Response(data, status=200)

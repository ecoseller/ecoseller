from enum import Enum
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions


class RSEvent(Enum):
    VIEW = "view"
    ADD_TO_CART = "add_to_cart"
    PURCHASE = "purchase"


class RSSituation(Enum):
    PRODUCT = "product"
    CART = "cart"


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

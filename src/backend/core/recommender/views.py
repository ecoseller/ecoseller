from enum import Enum, EnumMeta
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
        return Response(
            [
                {
                    "id": 1,
                    "title": "Product 1",
                    "price": "$25",
                    "image": "/images/products/1.jpg",
                    "url": "/",
                },
                {
                    "id": 2,
                    "title": "Product 2",
                    "price": "$20",
                    "image": "/images/products/2.jpg",
                    "url": "/",
                },
                {
                    "id": 3,
                    "title": "Product 3",
                    "price": "$25",
                    "image": "/images/products/1.jpg",
                    "url": "/",
                },
                {
                    "id": 4,
                    "title": "Product 4",
                    "price": "$20",
                    "image": "/images/products/1.jpg",
                    "url": "/",
                },
                {
                    "id": 5,
                    "title": "Product 5",
                    "price": "$25",
                    "image": "/images/products/1.jpg",
                    "url": "/",
                },
                {
                    "id": 6,
                    "title": "Product 6",
                    "price": "$20",
                    "image": "/images/products/1.jpg",
                    "url": "/",
                },
            ],
            status=200,
        )


class RecommenderSystemDashboardView(APIView):
    allowed_methods = ["GET"]
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        data = RecommenderSystemApi.get_dashboard(
            date_from=request.query_params["date_from"],
            date_to=request.query_params["date_to"],
        )
        return Response(data, status=200)


class RecommenderSystemConfigView(APIView):
    allowed_methods = ["PUT"]
    permission_classes = (permissions.AllowAny,)

    def put(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        RecommenderSystemApi.update_config(data=request.data)
        return Response({}, status=200)

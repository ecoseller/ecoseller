from enum import Enum, EnumMeta
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions

from api.recommender_system import RecommenderSystemApi
from order.models import Order


def _try_parse_number(value):
    try:
        return int(value)
    except:
        return value


def _parse_query_params(request):
    data = {**request.GET}

    for key in data:
        if len(data[key]) == 1:
            data[key] = data[key][0]
            if data[key].isdigit():
                data[key] = _try_parse_number(data[key])
    return data


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

    @classmethod
    def get_model_class(cls, event):
        if event == RSEvent.PRODUCT_DETAIL_ENTER.value:
            return "ProductDetailEnter"
        if event == RSEvent.PRODUCT_DETAIL_LEAVE.value:
            return "ProductDetailLeave"
        if event == RSEvent.PRODUCT_ADD_TO_CART.value:
            return "ProductAddToCart"
        if event == RSEvent.RECOMMENDATION_VIEW.value:
            return "RecommendationView"
        if event == RSEvent.ORDER.value:
            return "Order"
        raise ValueError(f"Unknown event: {event}")


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
        data = request.data["data"]
        print("DATA", data)
        if data is not None:
            if isinstance(data, dict):
                data = [data]
            for item in data:
                item["user_id"] = (
                    request.user if request.user.is_authenticated else None
                )
                item["_model_class"] = RSEvent.get_model_class(event)
                if event == RSEvent.ORDER.value:
                    order = Order.objects.get(pk=item["token"])
                    item["product_variants"] = [
                        (item.product_variant.sku, item.quantity)
                        for item in order.cart.cart_items.all()
                    ]
            try:
                RecommenderSystemApi.store_objects(data)
            except Exception as e:
                print(e)
                return Response({"message": "Error while storing data!"}, status=500)
        return Response(status=201)


class RecommenderSystemRecommendProductsView(APIView):
    allowed_methods = ["GET"]
    permission_classes = (permissions.AllowAny,)

    def get(self, request, situation):
        if situation not in RSSituation:
            return Response({"message": "Unknown RS situation!"}, status=404)
        data = _parse_query_params(request)
        data["user_id"] = request.user if request.user.is_authenticated else None
        print("DATA", data, situation)
        data["recommendation_type"] = situation
        products = RecommenderSystemApi.get_recommendations(data)
        print("PRODUCTS", products)
        # response format
        # [{
        #     "product_variant_sku": "a",
        #     "rs_info": rs_info
        # },...]

        # TODO: Add missing values
        recommendations = [
            {
                "product_id": 42,
                "product_variant_sku": p["product_variant_sku"],
                "title": "Product 1",
                "price": "$25",
                "image": "/images/products/1.jpg",
                "url": "/",
                "rs_info": p["rs_info"],
            }
            for p in products
        ]

        return Response(
            recommendations,
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

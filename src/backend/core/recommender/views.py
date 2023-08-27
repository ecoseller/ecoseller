from enum import Enum, EnumMeta
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from django.conf import settings

from api.notifications.conf import (
    EventTypes,
)
from api.recommender_system import RecommenderSystemApi
from product.models import ProductVariant, Product, PriceList
from country.models import Country
from product.serializers import ProductStorefrontListSerializer


def _try_parse_number(value):
    try:
        return int(value)
    except ValueError:
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
            try:
                settings.NOTIFICATIONS_API.notify(
                    EventTypes[event],
                    data=data,
                )
            except Exception as e:
                print(e)
                return Response({"message": "Error while storing data!"}, status=500)
        return Response(status=201)


class RecommenderSystemRecommendProductsView(APIView):
    allowed_methods = ["GET"]
    permission_classes = (permissions.AllowAny,)
    pricelist = None
    country = None
    PRICE_LIST_URL_PARAM = "pricelist"
    COUNTRY_URL_PARAM = "country"

    def get(self, request, situation):
        if situation not in RSSituation:
            return Response({"message": "Unknown RS situation!"}, status=404)
        data = _parse_query_params(request)
        data["user_id"] = request.user if request.user.is_authenticated else None
        print("DATA", data, situation)
        data["recommendation_type"] = situation
        products = RecommenderSystemApi.get_recommendations(data)
        print("PRODUCTS", products)
        if products is None:
            products_query = ProductVariant.objects.order_by("?").all()
            limit = data.get("limit", 10)
            if limit is not None:
                products_query = products_query[:limit]
            products = [
                {"product_variant_sku": pv.sku, "rs_info": {}} for pv in products_query
            ]

        recommended_products = []
        for p in products:
            p_obj = Product.objects.filter(
                product_variants__in=[p["product_variant_sku"]]
            ).first()
            if p_obj is not None:
                recommended_products.append(p_obj)

        # serialize products into simmilar format as in the category
        serializer = self._serialize_products(recommended_products, request)

        return Response(
            serializer.data,
            status=200,
        )

    def _serialize_products(self, products, request):
        pricelist = self._get_pricelist(request)
        country = self._get_country(request)

        return ProductStorefrontListSerializer(
            products,
            many=True,
            context={
                "request": request,
                "pricelist": pricelist,
                "country": country,
            },
        )

    def _get_pricelist(self, request):
        """get price list from request params or default to the default one"""
        """ set pricelist to the sort function as a parameter """
        if self.pricelist is not None:
            return self.pricelist
        price_list_code = request.query_params.get(self.PRICE_LIST_URL_PARAM, None)
        price_list_obj = None
        if price_list_code:
            try:
                price_list_obj = PriceList.objects.get(code=price_list_code)
            except PriceList.DoesNotExist:
                price_list_obj = PriceList.objects.get(is_default=True)
        else:
            price_list_obj = PriceList.objects.get(is_default=True)
        return price_list_obj

    def _get_country(self, request):
        """Get country URL param"""
        country_code = request.query_params.get(self.COUNTRY_URL_PARAM, None)
        try:
            return Country.objects.get(code=country_code)
        except Country.DoesNotExist:
            country = Country.objects.all().first()

        return country


class RecommenderSystemDashboardView(APIView):
    allowed_methods = ["GET"]
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        data = RecommenderSystemApi.get_dashboard(
            date_from=request.query_params["date_from"],
            date_to=request.query_params["date_to"],
            page=request.query_params["page"],
        )
        return Response(data, status=200)


class RecommenderSystemConfigView(APIView):
    allowed_methods = ["PUT"]
    permission_classes = (permissions.AllowAny,)

    def put(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        data = request.data
        data["_model_class"] = "Config"
        settings.NOTIFICATIONS_API.notify(
            EventTypes.RECOMMENDER_CONFIG_SAVE,
            data=data,
        )
        return Response({}, status=200)

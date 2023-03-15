from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from core.pagination import (
    DashboardPagination,
)

from .models import (
    Product,
    ProductVariant,
    ProductImage,
    ProductVariantImage,
    PriceList,
    ProductPrice,
)
from .serializers import (
    ProductSerializer,
    ProductDashboardListSerializer,
    ProductDashboardDetailSerializer,
    PriceListBaseSerializer,
)


"""
Dashboard views
"""


class ProductListDashboard(APIView, DashboardPagination):
    """
    List all products for dashboard
    """

    # TODO: add permissions for dashboard views (only for staff) <- testing purposes
    permission_classes = (permissions.AllowAny,)
    pagination_class = DashboardPagination()

    locale = "en"

    def get(self, request):
        self.locale = request.GET.get("locale", "en")
        products = Product.objects.all()
        serialized_products = ProductDashboardListSerializer(
            products, many=True, context={"locale": self.locale}
        )
        # paginate
        a = "spd"
        paginated_products = self.paginate_queryset(serialized_products.data, request)
        return self.get_paginated_response(paginated_products)


class ProductDetailDashboard(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error": "Product does not exist"}, status=404)
        serialized_product = ProductDashboardDetailSerializer(product)
        return Response(serialized_product.data, status=200)

    def put(self, request, id):
        raise NotImplementedError("PUT method not implemented yet")

    def delete(self, request, id):
        raise NotImplementedError("DELETE method not implemented yet")

    def patch(self, request, id):
        raise NotImplementedError("PATCH method not implemented yet")


class PriceListDashboard(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        qs = PriceList.objects.all()
        serializer = PriceListBaseSerializer(qs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = PriceListBaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, code):
        try:
            price_list = PriceList.objects.get(code=code)
            serializer = PriceListBaseSerializer(price_list, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except PriceList.DoesNotExist:
            return Response(status=404)

    def delete(self, request, code):
        try:
            price_list = PriceList.objects.get(code=code)
            price_list.delete()
            return Response(status=204)
        except PriceList.DoesNotExist:
            return Response(status=404)


"""
Storefront views
"""


class ProductDetailStorefront(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error": "Product does not exist"}, status=404)

        serialized_product = ProductSerializer(product)
        return Response(serialized_product.data, status=200)

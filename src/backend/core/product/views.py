from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from core.pagination import (DashboardPagination, )

from .models import (Product, ProductVariant, ProductImage, ProductVariantImage, PriceList, ProductPrice, )
from .serializers import (ProductSerializer, ProductDashboardListSerializer, ProductDashboardDetailSerializer, )


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
        serialized_products = ProductDashboardListSerializer(products, many=True, context={"locale": self.locale})
        # paginate
        a='spd'
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




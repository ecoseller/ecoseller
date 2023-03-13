from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from core.pagination import (DashboardPagination, )

from .models import (Product, ProductVariant, ProductImage, ProductVariantImage, PriceList, ProductPrice, )
from .serializers import (ProductSerializer, )


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
    def get(self, request):
        products = Product.objects.all()
        serialized_products = ProductDashboardListSerializer(products, many=True)
        return Response(serialized_products.data, status=200)


        


class ProductDetailDashboard(APIView):
    def get(self, request, id):
        return Response({"id": id})


"""
Storefront views
"""

class ProductDetailStorefront(APIView):
    def get(self, request, id):
        
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error": "Product does not exist"}, status=404)
        
        serialized_product = ProductSerializer(product)
        return Response(serialized_product.data, status=200)




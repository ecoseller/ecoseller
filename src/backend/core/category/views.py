# from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from rest_framework.generics import (
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)
from rest_framework.views import APIView

from category.models import Category
from category.serializers import (
    CategoryDetailDashboardSerializer,
    CategoryRecursiveDashboardSerializer,
    CategoryRecursiveStorefrontSerializer,
    CategoryDetailStorefrontSerializer,
)
from product.models import Product, ProductVariant, PriceList
from product.serializers import ProductStorefrontListSerializer


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryDashboardView(APIView):
    """
    View for listing all categories and adding new ones.
    Used for dashboard.
    """

    def get(self, request):
        """
        Gets all published categories.
        Language-specific data are returned only in the selected language (set in `Accept-Language` header).
        If this header isn't present, Django app language is used instead.
        """
        categories = Category.objects.filter(
            parent=None
        )  # .all()  # filter(published=True)
        serializer = CategoryRecursiveDashboardSerializer(
            categories, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def post(self, request):
        """
        Adds a new category
        """
        serializer = CategoryDetailDashboardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryDetailDashboardView(RetrieveUpdateDestroyAPIView):
    """
    View for getting (by ID), updating and deleting categories.
    """

    queryset = Category.objects.all()
    serializer_class = CategoryDetailDashboardSerializer

    # def perform_destroy(self, instance):
    #     """
    #     Custom method for deletion.
    #     Marks the selected category as "not published".
    #     """
    #     instance.published = False
    #     instance.save()


@permission_classes([AllowAny])
class CategoryStorefrontView(APIView):
    """
    View for getting all categories.
    Used for storefront.
    """

    def get(self, request):
        """
        Gets all published categories for storefront.
        Language-specific data are returned only in the selected language (set in `Accept-Language` header).
        If this header isn't present, Django app language is used instead.
        """
        root_categories = Category.objects.filter(parent=None, published=True)
        serializer = CategoryRecursiveStorefrontSerializer(
            root_categories, many=True, context={"request": request}
        )
        return Response(serializer.data)


@permission_classes([AllowAny])
class CategoryDetailStorefrontView(APIView):
    """
    View for getting detailed info about a category.
    Used for storefront.
    """

    def get(self, request, pk):
        """
        Gets detail of the given category.
        Language-specific data are returned only in the selected language (set in `Accept-Language` header).
        If this header isn't present, Django app language is used instead.
        """
        try:
            category = Category.objects.get(id=pk, published=True)
            serializer = CategoryDetailStorefrontSerializer(
                category, context={"request": request}
            )
            return Response(serializer.data)
        except Category.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
class CategoryDetailProductsStorefrontView(APIView):
    """
    View for getting all products in the given category.
    Used for storefront.
    """

    PRICE_LIST_URL_PARAM = "price_list"

    def get(self, request, pk):
        try:
            category = Category.objects.get(id=pk, published=True)
            products = _get_all_published_products(category)

            pricelist = self._get_pricelist(request)

            serializer = ProductStorefrontListSerializer(
                products,
                many=True,
                context={"request": request, "price_list": pricelist},
            )

            return Response(serializer.data)
        except Category.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)

    def _get_pricelist(self, request):
        # get price list from request params or default to the default one
        price_list_code = request.query_params.get(self.PRICE_LIST_URL_PARAM, None)
        if price_list_code:
            try:
                return PriceList.objects.get(code=price_list_code)
            except PriceList.DoesNotExist:
                return PriceList.objects.get(is_default=True)
        else:
            return PriceList.objects.get(is_default=True)


def _get_prices(product, price_list):
    return [
        p.formatted_price
        for v in product.product_variants.all()
        for p in v.price.filter(price_list=price_list)
    ]


def _get_all_subcategory_ids(category):
    """
    Get IDs of all subcategories (including recursive) under the given category
    """
    children = category.published_children
    return [category.id] + [id for c in children for id in _get_all_subcategory_ids(c)]


def _get_all_published_products(category):
    """
    Get all published products in the given category
    """
    subcategory_ids = _get_all_subcategory_ids(category)
    return Product.objects.filter(published=True, category__in=subcategory_ids)


# @permission_classes([AllowAny])  # TODO: use authentication
# class CategoryChildrenViewDashboard(APIView):
#     """
#     View for getting a category including its children categories
#     """
#
#     def get(self, request, id):
#         """
#         Get a category including its children
#         """
#         category = Category.objects.get(id=id)
#         serializer = CategoryWithChildrenSerializer(category)
#         return Response(serializer.data)

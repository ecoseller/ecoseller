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
<<<<<<< HEAD
=======
from common.common import get_url_param_if_valid
>>>>>>> master
from country.models import Country
from product.models import Product, PriceList
from product.serializers import ProductStorefrontListSerializer
from roles.decorator import check_user_access_decorator
from roles.decorator import check_user_is_staff_decorator


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryDashboardView(APIView):
    """
    View for listing all categories and adding new ones.
    Used for dashboard.
    """

    @check_user_is_staff_decorator()
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

    @check_user_access_decorator({"category_add_permission"})
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

    @check_user_is_staff_decorator()
    def get(self, request, pk):
        return super().get(request, pk)

    @check_user_access_decorator({"category_change_permission"})
    def put(self, request, pk):
        return super().put(request, pk)

    @check_user_access_decorator({"category_change_permission"})
    def delete(self, request, pk):
        return super().delete(request, pk)

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


def _get_min_variant_price(serialized_product):
    """
    Get minimal price of the serialized product variant prices
    """
    return min(
        serialized_product["variant_prices"], key=lambda variant: variant["incl_vat"]
    )["incl_vat"]


@permission_classes([AllowAny])
class CategoryDetailProductsStorefrontView(APIView):
    """
    View for getting all products in the given category.
    Used for storefront.
    """

    PRICE_LIST_URL_PARAM = "pricelist"
    COUNTRY_URL_PARAM = "country"
    SORT_URL_PARAM = "sort_by"
    ORDER_URL_PARAM = "order"

    ALLOWED_ORDER_FIELDS = ["asc", "desc"]
    SORT_FIELDS_CONFIG = {
        "title": {},
        "price": {"sort_function": _get_min_variant_price},
    }

    def get(self, request, pk):
        try:
            category = Category.objects.get(id=pk, published=True)

            # Get and process sort & order params
            sort_by = get_url_param_if_valid(
                request, self.SORT_URL_PARAM, self.SORT_FIELDS_CONFIG
            )
            order = get_url_param_if_valid(
                request,
                self.ORDER_URL_PARAM,
                self.ALLOWED_ORDER_FIELDS,
                default_param_value="asc",
            )

            is_reverse_order = order == "desc"
            sort_key_function = (
                (
                    self.SORT_FIELDS_CONFIG[sort_by]["sort_function"]
                    if "sort_function" in self.SORT_FIELDS_CONFIG[sort_by]
                    else lambda p: p[sort_by]
                )
                if sort_by is not None
                else None
            )

            # Get related objects
            products = _get_all_published_products(category)
            pricelist = self._get_pricelist(request)
            country = self._get_country(request)

            serializer = ProductStorefrontListSerializer(
                products,
                many=True,
                context={
                    "request": request,
                    "pricelist": pricelist,
                    "country": country,
                },
            )

            sorted_data = (
                sorted(serializer.data, key=sort_key_function, reverse=is_reverse_order)
                if sort_by is not None
                else serializer.data
            )

            return Response(sorted_data)
        except Category.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)

    def _get_pricelist(self, request):
        """get price list from request params or default to the default one"""
        price_list_code = request.query_params.get(self.PRICE_LIST_URL_PARAM, None)
        if price_list_code:
            try:
                return PriceList.objects.get(code=price_list_code)
            except PriceList.DoesNotExist:
                return PriceList.objects.get(is_default=True)
        else:
            return PriceList.objects.get(is_default=True)

    def _get_country(self, request):
        """Get country URL param"""
        country_code = request.query_params.get(self.COUNTRY_URL_PARAM, None)
        try:
            return Country.objects.get(code=country_code)
        except Country.DoesNotExist:
            country = Country.objects.all().first()

        return country


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

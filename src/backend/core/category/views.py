from typing import Dict, Optional

from django.apps import apps
from django.db.models import Min, QuerySet, OuterRef, Subquery, Value, Case, When
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

from api.recommender_system import RecommenderSystemApi
from category.models import Category
from category.serializers import (
    CategoryDetailDashboardSerializer,
    CategoryRecursiveDashboardSerializer,
    CategoryRecursiveStorefrontSerializer,
    CategoryDetailStorefrontSerializer,
    SelectedFiltersWithOrderingSerializer,
)
from core.pagination import StorefrontPagination
from country.models import Country
from product.models import (
    Product,
    ProductPrice,
    PriceList,
    AttributeTypeValueType,
    AttributeType,
    ProductType,
)
from product.serializers import (
    ProductStorefrontListSerializer,
    AttributeTypeFilterStorefrontSerializer,
)
from roles.decorator import check_user_access_decorator
from roles.decorator import check_user_is_staff_decorator


@permission_classes([AllowAny])
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


@permission_classes([AllowAny])
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


def _get_min_variant_price(product: Product, pricelist: PriceList):
    """
    Get minimal price of the product's variant prices
    """
    lowest_price = (
        ProductPrice.objects.values("price")
        .filter(
            product_variant__in=product.product_variants.all(),
            price_list__code=pricelist.code,
        )
        .aggregate(Min("price"))["price__min"]
    )
    return lowest_price


def _order_by_price(products, is_reverse_order, pricelist: PriceList):
    """
    Extend product query by extra field with lowest price of the product's variant prices
    """

    products = products.annotate(
        price=Subquery(
            ProductPrice.objects.filter(
                product_variant__in=OuterRef("product_variants"),
                price_list__code=pricelist.code,
            )
            .order_by("price")
            .values("price")[:1]
        )
    ).order_by("price" if not is_reverse_order else "-price")
    return products


def _order_by_title(products, is_reverse_order, locale: str):
    """
    Extend product query by extra field with lowest price of the product's variant prices
    """
    ProductTranslation = apps.get_model("product", "ProductTranslation")

    products = products.annotate(
        title=Subquery(
            ProductTranslation.objects.filter(
                master=OuterRef("id"), language_code=locale
            ).values("title")[:1]
        )
    ).order_by("title" if not is_reverse_order else "-title")
    return products


def _order_by_recommendation(
    products, is_reverse_order, recommendations: Optional[Dict[str, int]]
):
    if recommendations is None:
        recommendations = {}

    products = products.annotate(
        recommended=Case(
            *[
                When(id=int(product_id), then=Value(position))
                for product_id, position in recommendations.items()
            ],
            default=len(recommendations)
        )
    ).order_by("recommended" if not is_reverse_order else "-recommended")
    query = products.query
    query.group_by = ["id"]
    return QuerySet(query=query, model=Product)


@permission_classes([AllowAny])
class CategoryDetailProductsStorefrontView(APIView):
    """
    View for getting all products in the given category.
    Used for storefront.
    """

    pagination = StorefrontPagination()
    pricelist = None
    locale = None
    session_id = None
    recommendations = None
    PRICE_LIST_URL_PARAM = "pricelist"
    SESSION_ID_URL_PARAM = "recommender_session_id"
    COUNTRY_URL_PARAM = "country"

    ALLOWED_ORDER_FIELDS = ["asc", "desc"]
    DEFAULT_ORDER_FIELD = "asc"
    SORT_FIELDS_CONFIG = {
        "title": {
            "sort_function": _order_by_title,
            "additional_params": [locale],
        },
        "price": {
            "sort_function": _order_by_price,
            "additional_params": [pricelist],
        },
        "recommended": {
            "sort_function": _order_by_recommendation,
            "additional_params": [recommendations],
        },
    }

    def get(self, request, pk):
        try:
            category = Category.objects.get(id=pk, published=True)
            products = _get_all_published_products(category)
            paginated_products = self.pagination.paginate_queryset(
                queryset=products, request=request
            )
            serializer = self._serialize_products(paginated_products, request)
            return self.pagination.get_paginated_response(serializer.data)
        except Category.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)

    def post(self, request, pk):
        self.pricelist = self._get_pricelist(request)
        self.locale = self._get_locale(request)
        self.session_id = self._get_session_id(request)
        request_serializer = SelectedFiltersWithOrderingSerializer(data=request.data)

        if request_serializer.is_valid():
            filters_with_ordering = request_serializer.create(
                request_serializer.validated_data
            )

            try:
                category = Category.objects.get(id=pk, published=True)

                sort_by, order = (
                    filters_with_ordering.sort_by,
                    filters_with_ordering.order,
                )

                if sort_by == "recommended":
                    self.recommendations = (
                        RecommenderSystemApi.get_category_product_positions(
                            category_id=pk,
                            user_id=request.user
                            if request.user.is_authenticated
                            else None,
                            session_id=self.session_id,
                        )
                    )
                    self.SORT_FIELDS_CONFIG["recommended"]["additional_params"] = [
                        self.recommendations
                    ]

                order = (
                    order
                    if order in self.ALLOWED_ORDER_FIELDS
                    else self.DEFAULT_ORDER_FIELD
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
                sort_key_function_params = (
                    (
                        self.SORT_FIELDS_CONFIG[sort_by]["additional_params"]
                        if "additional_params" in self.SORT_FIELDS_CONFIG[sort_by]
                        else []
                    )
                    if sort_by is not None
                    else []
                )

                # Get related objects
                products = _get_all_published_products(category)

                filtered_products = self._filter_products(
                    products, filters_with_ordering.filters
                )

                if sort_key_function is not None:
                    sorted_data = sort_key_function(
                        filtered_products, is_reverse_order, *sort_key_function_params
                    )
                else:
                    sorted_data = filtered_products

                paginated_sorted_products = self.pagination.paginate_queryset(
                    queryset=sorted_data, request=request
                )
                serializer = self._serialize_products(
                    paginated_sorted_products, request
                )
                return self.pagination.get_paginated_response(serializer.data)
            except Category.DoesNotExist:
                return Response(status=HTTP_404_NOT_FOUND)
        else:
            return Response(status=HTTP_400_BAD_REQUEST)

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

    def _get_locale(self, request):
        """get locale from request params or default to the default one"""
        """ set locale to the sort function as a parameter """
        if self.locale is not None:
            return self.locale
        self.locale = request.META.get("HTTP_ACCEPT_LANGUAGE", "en")
        self.SORT_FIELDS_CONFIG["title"]["additional_params"] = [self.locale]
        return self.locale

    def _get_session_id(self, request):
        if self.session_id is not None:
            return self.session_id
        self.session_id = request.query_params.get(self.SESSION_ID_URL_PARAM)
        return self.session_id

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
        self.SORT_FIELDS_CONFIG["price"]["additional_params"] = [price_list_obj]
        return price_list_obj

    def _get_country(self, request):
        """Get country URL param"""
        country_code = request.query_params.get(self.COUNTRY_URL_PARAM, None)
        try:
            return Country.objects.get(code=country_code)
        except Country.DoesNotExist:
            country = Country.objects.all().first()

        return country

    def _filter_products(self, products, filters):
        # deal with both types of attributes
        print(filters.textual)
        for filter in filters.textual + filters.numeric:
            if filter.selected_values_ids:
                # this will behave as AND
                products = products.filter(
                    # this will behave as OR
                    product_variants__attributes__in=filter.selected_values_ids
                )
        return products.distinct()


@permission_classes([AllowAny])
class CategoryDetailAttributesStorefrontView(APIView):
    """
    View for getting all product attributes in the given category.

    Used for storefront.
    """

    def get(self, request, pk):
        try:
            category = Category.objects.get(id=pk, published=True)

            # Get related objects
            products = _get_all_published_products(category)
            attributes = self._get_attributes(products)

            serializer_text = AttributeTypeFilterStorefrontSerializer(
                attributes.textual, many=True, context={"request": request}
            )

            serializer_num = AttributeTypeFilterStorefrontSerializer(
                attributes.numeric, many=True, context={"request": request}
            )
            response_obj = {
                "textual": serializer_text.data,
                "numeric": serializer_num.data,
            }

            return Response(response_obj)
        except Category.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)

    def _get_attributes(self, products):
        numeric_attributes = {}
        string_attributes = {}

        attribute_types = AttributeType.objects.filter(
            producttype__in=ProductType.objects.filter(product__in=products).distinct()
        ).distinct()

        for attr in attribute_types:
            if (
                attr.value_type == AttributeTypeValueType.TEXT
                and attr.id not in string_attributes
            ):
                string_attributes[attr.id] = attr
            elif (
                attr.value_type
                in [AttributeTypeValueType.DECIMAL, AttributeTypeValueType.INTEGER]
                and attr.id not in numeric_attributes
            ):
                numeric_attributes[attr.id] = attr

        return CategoryAttributeTypes(
            list(string_attributes.values()), list(numeric_attributes.values())
        )


class CategoryAttributeTypes:
    def __init__(self, textual, numeric):
        self.textual, self.numeric = textual, numeric


def _get_all_subcategory_ids(category):
    """
    Get IDs of all subcategories (including recursive) under the given category
    """
    children = category.published_children
    return [category.id] + [id for c in children for id in _get_all_subcategory_ids(c)]


def _get_all_published_products(category):
    """
    Get all published products in the given category

    Prefetch also Product variants.
    """
    subcategory_ids = _get_all_subcategory_ids(category)
    return Product.objects.filter(
        published=True, category__in=subcategory_ids
    ).prefetch_related("product_variants")

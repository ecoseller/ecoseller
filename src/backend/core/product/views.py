from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import permissions
from core.pagination import (
    DashboardPagination,
)

from .models import (
    Product,
    ProductVariant,
    PriceList,
    AttributeType,
    BaseAttribute,
    ProductMedia,
    ProductType,
)

from country.models import (
    Country,
)

from .serializers import (
    ProductStorefrontDetailSerializer,
    ProductDashboardListSerializer,
    ProductDashboardDetailSerializer,
    PriceListBaseSerializer,
    AtrributeTypeDashboardSerializer,
    BaseAttributeDashboardSerializer,
    ProductVariantSerializer,
    ProductMediaDetailsSerializer,
    ProductTypeSerializer,
)

from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)


"""
Dashboard views
"""


class ProductVariantDashboard(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, requests, sku):
        try:
            product_variant = ProductVariant.objects.get(sku=sku)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Product variant does not exist"}, status=404)
        serialized_product_variant = ProductVariantSerializer(product_variant)
        return Response(serialized_product_variant.data, status=200)


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
            products, many=True, context={"locale": self.locale, "request": request}
        )
        # paginate
        paginated_products = self.paginate_queryset(serialized_products.data, request)
        return self.get_paginated_response(paginated_products)


class ProductDashboardView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = ProductDashboardDetailSerializer

    def get_queryset(self):
        return Product.objects.all()

    def get(self, request):
        products = self.get_queryset()
        serializer = self.serializer_class(products, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response({**serializer.data, "id": instance.id}, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=400)


class ProductDetailDashboardView(RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "PUT", "DELETE"]
    authentication_classes = []
    serializer_class = ProductDashboardDetailSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return Product.objects.all()


class PriceListDashboardView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = PriceListBaseSerializer

    def get_queryset(self):
        return PriceList.objects.all()

    def get(self, request):
        price_lists = self.get_queryset()
        serializer = self.serializer_class(price_lists, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response({**serializer.data, "code": instance.code}, status=201)
        return Response(serializer.errors, status=400)


class PriceListDashboardDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["PUT", "DELETE"]
    authentication_classes = []
    serializer_class = PriceListBaseSerializer
    lookup_field = "code"
    lookup_url_kwarg = "code"

    def get_queryset(self):
        return PriceList.objects.all()


class ProductTypeDashboardView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = ProductTypeSerializer

    def get_queryset(self):
        return ProductType.objects.all()

    def get(self, request):
        product_types = self.get_queryset()
        serializer = self.serializer_class(product_types, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response({**serializer.data, "id": instance.id}, status=201)
        return Response(serializer.errors, status=400)


class ProductTypeDashboardDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["PUT", "DELETE"]
    authentication_classes = []
    serializer_class = ProductTypeSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return ProductType.objects.all()


class AttributeTypeDashboardView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = AtrributeTypeDashboardSerializer

    def get_queryset(self):
        return AttributeType.objects.all()

    def get(self, request):
        attribute_types = self.get_queryset()
        serializer = self.serializer_class(attribute_types, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response({**serializer.data, "id": instance.id}, status=201)
        return Response(serializer.errors, status=400)


class AttributeTypeDashboardDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["PUT", "DELETE"]
    authentication_classes = []
    serializer_class = AtrributeTypeDashboardSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return AttributeType.objects.all()


class BaseAttributeDashboardView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = BaseAttributeDashboardSerializer

    def get_queryset(self):
        return BaseAttribute.objects.all()

    def get(self, request):
        attribute_types = self.get_queryset()
        serializer = self.serializer_class(attribute_types, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response({**serializer.data, "id": instance.id}, status=201)
        return Response(serializer.errors, status=400)


class BaseAttributeDashboardDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["PUT", "DELETE"]
    authentication_classes = []
    serializer_class = BaseAttributeDashboardSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return BaseAttribute.objects.all()


"""
Storefront views
"""


class ProductDetailStorefront(APIView):
    permission_classes = (permissions.AllowAny,)

    def get_pricelist(self, request):
        # obtain pricelist id from request query params or default to `is_default=True`
        pricelist_code = request.GET.get("pricelist", None)
        if pricelist_code:
            try:
                pricelist = PriceList.objects.get(code=pricelist_code)
            except PriceList.DoesNotExist:
                pricelist = PriceList.objects.get(is_default=True)
        else:
            pricelist = PriceList.objects.get(is_default=True)
        return pricelist

    def get_country(self, request):
        # obtain country id from request query params or default to `is_default=True`
        country_code = request.GET.get("country", None)
        if country_code:
            try:
                country = Country.objects.get(code=country_code)
            except Country.DoesNotExist:
                country = Country.objects.all().first()

        return country

    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk, published=True)
        except Product.DoesNotExist:
            return Response({"error": "Product does not exist"}, status=404)

        pricelist = self.get_pricelist(request)
        country = self.get_country(request)

        serialized_product = ProductStorefrontDetailSerializer(
            product,
            context={
                "request": request,
                "pricelist": pricelist,
                "product_type": product.type,
                "country": country,
            },
        )
        return Response(serialized_product.data, status=200)


class ProductMediaUpload(GenericAPIView):
    allowed_methods = ["POST"]
    permission_classes = (permissions.AllowAny,)
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ProductMediaDetailsSerializer

    def post(self, request, *args, **kwargs):
        product_media_serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        if product_media_serializer.is_valid():
            product_media_serializer.save()
            return Response(product_media_serializer.data, status=201)
        else:
            return Response(product_media_serializer.errors, status=400)


class ProductMediaUploadDetailView(RetrieveUpdateDestroyAPIView):
    allowed_methods = ["GET", "PUT", "DELETE"]
    permission_classes = (permissions.AllowAny,)
    serializer_class = ProductMediaDetailsSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return ProductMedia.objects.all()

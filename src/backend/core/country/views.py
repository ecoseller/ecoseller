from django.conf import settings
from rest_framework import permissions
from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from user.models import User

from .models import (
    Country,
    Currency,
    VatGroup,
    ShippingInfo,
    BillingInfo,
)
from .serializers import (
    CountrySerializer,
    CurrencySerializer,
    VatGroupSerializer,
    ShippingInfoSerializer,
    BillingInfoSerializer,
    ShippingInfoListUserSerializer,
)

from roles.decorator import check_user_is_staff_decorator

DEFAULT_LANGUAGE_CODE = settings.PARLER_DEFAULT_LANGUAGE_CODE
LANGUAGES = settings.PARLER_LANGUAGES[None]
# from parler.utils.conf import LanguagesSetting


"""
Country views
"""


class CountryListView(ListCreateAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]

    serializer_class = CountrySerializer

    def get(self, request):
        return super().get(request)

    def get_queryset(self):
        return Country.objects.all()


class CountryDetailView(RetrieveUpdateDestroyAPIView):
    """
    Detail of country
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []

    serializer_class = CountrySerializer
    lookup_field = "code"
    lookup_url_kwarg = "code"

    @check_user_is_staff_decorator()
    def get(self, request, code):
        return super().get(request, code)

    def get_queryset(self):
        return Country.objects.all()


"""
Language views
"""


class LanguagesView(APIView):
    """
    List all products for dashboard
    """

    # TODO: add permissions for dashboard views (only for staff) <- testing purposes
    permission_classes = (permissions.AllowAny,)

    @check_user_is_staff_decorator()
    def get(self, request):
        langs = [
            {
                "code": lang["code"],
                "default": lang["code"] == DEFAULT_LANGUAGE_CODE,
            }
            for lang in LANGUAGES
        ]
        print(LANGUAGES)
        return Response(langs, status=200)


class CurrencyListView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "POST", "PUT", "DELETE"]

    serializer_class = CurrencySerializer

    def get_queryset(self):
        return Currency.objects.all()

    @check_user_is_staff_decorator()
    def get(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CurrencyDetailView(RetrieveUpdateDestroyAPIView):
    """
    List all products for dashboard
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "POST", "PUT", "DELETE"]

    serializer_class = CurrencySerializer
    lookup_field = "code"
    lookup_url_kwarg = "code"

    @check_user_is_staff_decorator()
    def get(self, request, code):
        return super().get(request, code)

    def get_queryset(self):
        return Currency.objects.all()


"""
Vat group views
"""


class VatGroupListView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]

    serializer_class = VatGroupSerializer

    def get_queryset(self):
        return VatGroup.objects.all()

    @check_user_is_staff_decorator()
    def get(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class VatGroupDetailView(RetrieveUpdateDestroyAPIView):
    """
    List all products for dashboard
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]

    serializer_class = VatGroupSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)

    def get_queryset(self):
        return VatGroup.objects.all()


"""
Address views
"""


class ShippingAddressDetailView(RetrieveUpdateDestroyAPIView):
    """
    Detail of shipping address
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []
    serializer_class = ShippingInfoSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)

    def get_queryset(self):
        return ShippingInfo.objects.all()


class BillingAddressDetailView(RetrieveUpdateDestroyAPIView):
    """
    Detail of billing address
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []
    serializer_class = BillingInfoSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)

    def get_queryset(self):
        return BillingInfo.objects.all()


class ShippingInfoListView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "POST"]
    serializer_class = ShippingInfoSerializer

    def get_queryset(self):
        return ShippingInfo.objects.all()

    def get(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class BillingInfoListView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "POST"]
    serializer_class = BillingInfoSerializer

    def get_queryset(self):
        return BillingInfo.objects.all()

    def get(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request, user_id):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user_id)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class ShippingInfoListUserView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "POST"]
    serializer_class = ShippingInfoListUserSerializer

    def get(self, request, user_id):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request, user_id):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=user_id)
                serializer.save(user=user)
                return Response(serializer.data, status=201)
            except User.DoesNotExist:
                return Response({"error": "User does not exist"}, status=400)
        return Response(serializer.errors, status=400)

    def get_queryset(self):
        return ShippingInfo.objects.filter(user=self.kwargs["user_id"])


class BillingInfoListUserView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "POST"]
    serializer_class = BillingInfoSerializer

    def get(self, request, user_id):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request, user_id):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=user_id)
                serializer.save(user=user)
                return Response(serializer.data, status=201)
            except User.DoesNotExist:
                return Response({"error": "User does not exist"}, status=400)
        return Response(serializer.errors, status=400)

    def get_queryset(self):
        return BillingInfo.objects.filter(user=self.kwargs["user_id"])


class ShippingInfoUserView(GenericAPIView):
    permissions_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "PUT"]
    serializer_class = ShippingInfoSerializer

    def get(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        qs = self.get_queryset(user_id)
        if qs.count() == 0:
            return Response({}, status=200)
        serializer = self.serializer_class(qs)
        return Response(serializer.data, status=200)

    def put(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        qs = self.get_queryset(user_id)
        serializer = self.serializer_class(qs, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response({"error": serializer.errors}, status=400)

    def get_queryset(self, user_id):
        if user_id is None:
            return None
        return ShippingInfo.objects.filter(user=user_id)


class BillingInfoUserView(GenericAPIView):
    permissions_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "PUT"]
    serializer_class = BillingInfoSerializer

    def get(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        qs = self.get_queryset(user_id)
        if qs.count() == 0:
            return Response({}, status=200)
        serializer = self.serializer_class(qs)
        return Response(serializer.data, status=200)

    def put(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        qs = self.get_queryset(user_id)
        serializer = self.serializer_class(qs, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response({"error": serializer.errors}, status=400)

    def get_queryset(self, user_id):
        if user_id is None:
            return None
        return BillingInfo.objects.filter(user=user_id)

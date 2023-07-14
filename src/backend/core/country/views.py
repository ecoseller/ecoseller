from django.conf import settings
from rest_framework import permissions
from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from roles.decorator import check_user_is_staff_decorator
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

DEFAULT_LANGUAGE_CODE = settings.PARLER_DEFAULT_LANGUAGE_CODE
LANGUAGES = settings.PARLER_LANGUAGES[None]
# from parler.utils.conf import LanguagesSetting


"""
Country views
"""


class CountryListView(ListCreateAPIView):
    """
    View for listing and creating countries
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]

    serializer_class = CountrySerializer

    def get(self, request):
        return super().get(request)

    @check_user_is_staff_decorator()
    def post(self, request, *args, **kwargs):
        return super().post(request, args, kwargs)

    def get_queryset(self):
        return Country.objects.all()


class CountryListStorefrontView(CountryListView):
    """
    View for listing all countries
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
    ]

    serializer_class = CountrySerializer

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

    @check_user_is_staff_decorator()
    def put(self, request, *args, **kwargs):
        return super().put(request, args, kwargs)

    @check_user_is_staff_decorator()
    def delete(self, request, *args, **kwargs):
        return super().delete(request, args, kwargs)

    def get_queryset(self):
        return Country.objects.all()


class CountryDetailStorefrontView(RetrieveUpdateDestroyAPIView):
    """
    Detail of country for storefront
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
    ]
    authentication_classes = []

    serializer_class = CountrySerializer
    lookup_field = "code"
    lookup_url_kwarg = "code"

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
    """
    View for listing and creating currency objects
    """

    allowed_methods = ["GET", "POST", "PUT", "DELETE"]

    serializer_class = CurrencySerializer

    def get_queryset(self):
        return Currency.objects.all()

    @check_user_is_staff_decorator()
    def get(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=200)

    @check_user_is_staff_decorator()
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=400)


class CurrencyDetailView(RetrieveUpdateDestroyAPIView):
    """
    View for getting, updating and deleting currencies
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "POST", "PUT", "DELETE"]

    serializer_class = CurrencySerializer
    lookup_field = "code"
    lookup_url_kwarg = "code"

    @check_user_is_staff_decorator()
    def get(self, request, code):
        return super().get(request, code)

    @check_user_is_staff_decorator()
    def put(self, request, *args, **kwargs):
        return super().put(request, args, kwargs)

    @check_user_is_staff_decorator()
    def delete(self, request, *args, **kwargs):
        return super().delete(request, args, kwargs)

    def get_queryset(self):
        return Currency.objects.all()


"""
Vat group views
"""


class VatGroupListView(GenericAPIView):
    """
    View for listing and creating VAT groups
    """

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

    @check_user_is_staff_decorator()
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class VatGroupDetailView(RetrieveUpdateDestroyAPIView):
    """
    View for getting, updating and deleting VAT groups
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

    @check_user_is_staff_decorator()
    def put(self, request, *args, **kwargs):
        return super().put(request, args, kwargs)

    @check_user_is_staff_decorator()
    def delete(self, request, *args, **kwargs):
        return super().delete(request, args, kwargs)

    def get_queryset(self):
        return VatGroup.objects.all()


"""
Address views
"""


class ShippingAddressDetailView(RetrieveUpdateDestroyAPIView):
    """
    View for getting, updating and removing shipping addresses
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

    @check_user_is_staff_decorator()
    def put(self, request, *args, **kwargs):
        return super().put(request, args, kwargs)

    @check_user_is_staff_decorator()
    def delete(self, request, *args, **kwargs):
        return super().delete(request, args, kwargs)

    def get_queryset(self):
        return ShippingInfo.objects.all()


class BillingAddressDetailView(RetrieveUpdateDestroyAPIView):
    """
    View for getting, updating and removing billing addresses
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

    @check_user_is_staff_decorator()
    def put(self, request, *args, **kwargs):
        return super().put(request, args, kwargs)

    @check_user_is_staff_decorator()
    def delete(self, request, *args, **kwargs):
        return super().delete(request, args, kwargs)

    def get_queryset(self):
        return BillingInfo.objects.all()


class ShippingInfoListView(GenericAPIView):
    """
    View for listing and creating shipping infos
    """

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
    """
    View for listing and creating billing infos
    """

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
    """
    View for listing and creating user's shipping info
    """

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
    """
    View for listing and creating user's billing info
    """

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
    """
    View for getting, updating and removing user's shipping info
    """

    permissions_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "PUT", "DELETE"]
    serializer_class = ShippingInfoSerializer

    def get(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        qs = self.get_queryset(user_id)
        if qs.count() == 0:
            return Response({}, status=200)
        serializer = self.serializer_class(qs.first())
        return Response(serializer.data, status=200)

    def put(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        qs = self.get_queryset(user_id)
        request.data["user"] = user_id
        if qs.count() == 0:
            serializer = self.serializer_class(data=request.data)
        else:
            serializer = self.serializer_class(qs.first(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        print(serializer.errors)
        return Response({"error": serializer.errors}, status=400)

    def delete(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        qs = self.get_queryset(user_id)
        if qs.count() == 0:
            return Response({}, status=200)
        qs.first().delete()
        return Response({}, status=200)

    def get_queryset(self, user_id):
        if user_id is None:
            return None
        return ShippingInfo.objects.filter(user=user_id)


class BillingInfoUserView(GenericAPIView):
    """
    View for getting, updating and removing user's billing info
    """

    permissions_classes = (permissions.AllowAny,)
    allowed_methods = ["GET", "PUT", "DELETE"]
    serializer_class = BillingInfoSerializer

    def get(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        qs = self.get_queryset(user_id)
        if qs.count() == 0:
            return Response({}, status=200)
        serializer = self.serializer_class(qs.first())
        return Response(serializer.data, status=200)

    def put(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        qs = self.get_queryset(user_id)
        request.data["user"] = user_id
        if qs.count() == 0:
            serializer = self.serializer_class(data=request.data)
        else:
            serializer = self.serializer_class(qs.first(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        print(serializer.errors)
        return Response({"error": serializer.errors}, status=400)

    def delete(self, request):
        user_id = request.user
        if user_id is None or not user_id.is_authenticated:
            return Response({"error": "Not logged in user"}, status=400)
        qs = self.get_queryset(user_id)
        if qs.count() == 0:
            return Response({}, status=200)
        qs.first().delete()
        return Response({}, status=200)

    def get_queryset(self, user_id):
        if user_id is None:
            return None
        return BillingInfo.objects.filter(user=user_id)

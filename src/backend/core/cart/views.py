from abc import ABC, abstractmethod

from rest_framework.decorators import permission_classes
from rest_framework.generics import RetrieveAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny

from rest_framework.response import Response
from rest_framework.status import (
    HTTP_404_NOT_FOUND,
    HTTP_400_BAD_REQUEST,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
)
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView

from cart.models import (
    Cart,
    CartItem,
    ShippingMethod,
    ShippingMethodCountry,
    PaymentMethod,
    PaymentMethodCountry,
)
from cart.serializers import (
    CartSerializer,
    CartItemUpdateSerializer,
    ShippingMethodSerializer,
    ShippingMethodDetailSerializer,
    ShippingMethodCountrySerializer,
    PaymentMethodSerializer,
    PaymentMethodDetailSerializer,
    PaymentMethodCountrySerializer,
    PaymentMethodCountryFullSerializer,
)
from country.serializers import AddressSerializer
from product.models import ProductVariant, ProductPrice

from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)


@permission_classes([AllowAny])  # TODO: use authentication
class CartDetailStorefrontView(RetrieveAPIView, CreateModelMixin):
    """
    View used for getting cart detail and adding items into cart
    """

    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    lookup_field = "token"

    def post(self, request, token):
        try:
            serializer = CartItemUpdateSerializer(data=request.data)
            if serializer.is_valid():
                update_data = serializer.save()

                cart = Cart.objects.get(token=token)
                product_variant = ProductVariant.objects.get(sku=update_data.sku)

                price = ProductPrice.objects.get(
                    product_variant=product_variant, price_list__is_default=True
                )  # TODO: use selected pricelist

                cart_item = CartItem(
                    cart=cart,
                    product_variant=product_variant,
                    unit_price_gross=price.price,
                    unit_price_net=price.price,
                    quantity=update_data.quantity,
                )
                cart_item.save()

                return Response(status=HTTP_201_CREATED)
            return Response(status=HTTP_400_BAD_REQUEST)
        except (Cart.DoesNotExist, ProductVariant.DoesNotExist):
            return Response(status=HTTP_404_NOT_FOUND)
        except ProductPrice.DoesNotExist:
            return Response(status=HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])
class CartUpdateQuantityStorefrontView(APIView):
    """
    View for updating cart items quantity
    """

    def put(self, request, token):
        try:
            serializer = CartItemUpdateSerializer(data=request.data)
            if serializer.is_valid():
                update_data = serializer.save()
                cart = Cart.objects.get(token=token)
                cart_item = cart.cart_items.get(product_variant__sku=update_data.sku)

                cart_item.quantity = update_data.quantity
                cart_item.save()

                return Response(status=HTTP_204_NO_CONTENT)
            return Response(status=HTTP_400_BAD_REQUEST)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(status=HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
class CartUpdateAddressBaseStorefrontView(APIView, ABC):
    """
    Base view for updating cart's billing/shipping address.
    Do not use this view directly, use inherited classes instead (and implement `_set_address` method)
    """

    @abstractmethod
    def _set_address(self, cart, address):
        """
        Set desired type of address
        """
        pass

    def put(self, request, token):
        try:
            serializer = AddressSerializer(data=request.data)
            if serializer.is_valid():
                address = serializer.save()
                cart = Cart.objects.get(token=token)

                self._set_address(cart, address)

                return Response(status=HTTP_204_NO_CONTENT)
            return Response(status=HTTP_400_BAD_REQUEST)
        except Cart.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
class CartUpdateBillingAddressStorefrontView(CartUpdateAddressBaseStorefrontView):
    """
    View for updating cart's billing address
    """

    def _set_address(self, cart, address):
        cart.billing_address = address
        cart.save()


@permission_classes([AllowAny])
class CartUpdateShippingAddressStorefrontView(CartUpdateAddressBaseStorefrontView):
    """
    View for updating cart's shipping address
    """

    def _set_address(self, cart, address):
        cart.shipping_address = address
        cart.save()


@permission_classes([AllowAny])
class CartItemDeleteStorefrontView(APIView):
    """
    View used for deleting cart items
    """

    def delete(self, request, token, sku):
        try:
            cart = Cart.objects.get(token=token)
            cart_item = cart.cart_items.get(product_variant__sku=sku)

            cart_item.delete()

            return Response(status=HTTP_204_NO_CONTENT)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(status=HTTP_404_NOT_FOUND)


class PaymentMethodListDashboardView(ListCreateAPIView):
    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = PaymentMethodSerializer
    queryset = PaymentMethod.objects.all()


class PaymentMethodDetailDashboardView(RetrieveUpdateDestroyAPIView):
    """
    List detail payment method
    """

    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []
    serializer_class = PaymentMethodDetailSerializer

    parser_classes = [MultiPartParser, FormParser, JSONParser]

    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return PaymentMethod.objects.all()


class PaymentMethodCountryListView(ListCreateAPIView):
    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = PaymentMethodCountrySerializer

    def get_queryset(self):
        method_id = self.kwargs.get("method_id")
        print(method_id)
        return PaymentMethodCountry.objects.filter(payment_method__id=method_id)


class PaymentMethodCountryDetailDashboardView(RetrieveUpdateDestroyAPIView):
    """
    Detail of payment method country
    """

    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []

    serializer_class = PaymentMethodCountrySerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return PaymentMethodCountry.objects.all()


class PaymentMethodCountryFullListView(ListCreateAPIView):
    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
    ]
    authentication_classes = []
    serializer_class = PaymentMethodCountryFullSerializer
    queryset = PaymentMethodCountry.objects.all()


class ShippingMethodListDashboardView(ListCreateAPIView):
    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = ShippingMethodSerializer
    queryset = ShippingMethod.objects.all()


class ShippingMethodDetailDashboardView(RetrieveUpdateDestroyAPIView):
    """
    List detail shipping method
    """

    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []
    serializer_class = ShippingMethodDetailSerializer

    parser_classes = [MultiPartParser, FormParser, JSONParser]

    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return ShippingMethod.objects.all()


class ShippingMethodCountryListView(ListCreateAPIView):
    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = ShippingMethodCountrySerializer

    def get_queryset(self):
        method_id = self.kwargs.get("method_id")
        print(method_id)
        return ShippingMethodCountry.objects.filter(shipping_method__id=method_id)


class ShippingMethodCountryDetailDashboardView(RetrieveUpdateDestroyAPIView):
    """
    List all products for dashboard
    """

    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
        "DELETE",
    ]
    authentication_classes = []

    serializer_class = ShippingMethodCountrySerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return ShippingMethodCountry.objects.all()

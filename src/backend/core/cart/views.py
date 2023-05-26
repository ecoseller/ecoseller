from abc import ABC, abstractmethod

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import permission_classes
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_404_NOT_FOUND,
    HTTP_400_BAD_REQUEST,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
)
from rest_framework.views import APIView

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
    CartTokenSerializer,
)
from country.serializers import (
    BillingInfoSerializer,
    ShippingInfoSerializer,
)
from product.models import ProductVariant, ProductPrice

from roles.decorator import check_user_is_staff_decorator


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
                product = update_data.product
                pricelist = update_data.pricelist
                price = ProductPrice.objects.get(
                    product_variant=product_variant, price_list=pricelist
                )
                country = update_data.country
                vat = product.type.vat_groups.all().filter(country=country).first()

                if not vat:
                    vat = 0
                else:
                    vat = vat.rate

                cart.recalculate(
                    pricelist=pricelist,
                    country=country,
                )

                cart_item = CartItem(
                    cart=cart,
                    product_variant=product_variant,
                    product=product,
                    unit_price_gross=price.price
                    if not price.discount
                    else price.discounted_price,
                    unit_price_net=price.price_incl_vat(vat)
                    if not price.discount
                    else price.discounted_price_incl_vat(vat),
                    quantity=update_data.quantity,
                )
                cart_item.save()

                return Response(status=HTTP_201_CREATED)
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        except (Cart.DoesNotExist, ProductVariant.DoesNotExist):
            return Response({"error": "Cart does not exist"}, status=HTTP_404_NOT_FOUND)
        except ProductPrice.DoesNotExist:
            return Response(
                {"error": "ProductPrice does not exist"}, status=HTTP_400_BAD_REQUEST
            )


@permission_classes([AllowAny])
class CartCreateStorefrontView(APIView):
    """
    View used for creating cart
    """

    def post(self, request):
        cart = Cart.objects.create()
        # TODO: set user if logged-in
        cart.save()
        if not request.data:
            serializer = CartTokenSerializer(cart)
            return Response(serializer.data)
        try:
            print(request.data)
            item_serializer = CartItemUpdateSerializer(data=request.data)
            if item_serializer.is_valid():
                update_data = item_serializer.save()
                product_variant = ProductVariant.objects.get(sku=update_data.sku)
                product = update_data.product
                pricelist = update_data.pricelist
                price = ProductPrice.objects.get(
                    product_variant=product_variant, price_list=pricelist
                )
                country = update_data.country
                vat = product.type.vat_groups.all().filter(country=country).first()

                if not vat:
                    vat = 0
                else:
                    vat = vat.rate

                cart.recalculate(
                    pricelist=pricelist,
                    country=country,
                )

                cart_item = CartItem(
                    cart=cart,
                    product_variant=product_variant,
                    product=product,
                    unit_price_gross=price.price
                    if not price.discount
                    else price.discounted_price,
                    unit_price_net=price.price_incl_vat(vat)
                    if not price.discount
                    else price.discounted_price_incl_vat(vat),
                    quantity=update_data.quantity,
                )
                cart_item.save()
                serializer = CartTokenSerializer(cart)
                return Response(serializer.data)
            print(item_serializer.errors)
            return Response(item_serializer.errors, status=HTTP_400_BAD_REQUEST)
        except ProductPrice.DoesNotExist:
            print("ProductPrice does not exist")
            return Response(
                {"error": "ProductPrice does not exist"}, status=HTTP_400_BAD_REQUEST
            )


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


class CartUpdateInfoBaseStorefrontView(APIView, ABC):
    """
    Base view for updating cart's billing/shipping info
    Do not use this view directly, use inherited classes instead (and implement `_set_info` method)
    """

    info_serializer = (
        None  # set in inherited classes (Billing/Shipping info serializers)
    )

    @abstractmethod
    def _set_info(self, cart, info):
        """
        Set desired type of info
        """
        pass

    @abstractmethod
    def _get_info(self, cart):
        """
        Get desired type of info
        """
        pass

    def put(self, request, token):
        try:
            cart = Cart.objects.get(token=token)
            if self._get_info(cart) is not None:
                # if we have info already, update it
                info = self._get_info(cart)
                serializer = self.info_serializer(info, data=request.data)
            else:
                # if we don't have info, create it
                serializer = self.info_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                self._set_info(cart, info)
                return Response(status=HTTP_204_NO_CONTENT)
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        except Cart.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
class CartUpdateBillingInfoStorefrontView(CartUpdateInfoBaseStorefrontView):
    """
    View for updating cart's billing info
    """

    info_serializer = BillingInfoSerializer

    def _set_info(self, cart, info):
        cart.billing_info = info
        cart.save()

    def _get_info(self, cart):
        return cart.billing_info


@permission_classes([AllowAny])
class CartUpdateShippingInfoStorefrontView(CartUpdateInfoBaseStorefrontView):
    """
    View for updating cart's shipping info
    """

    info_serializer = ShippingInfoSerializer

    def _set_info(self, cart, info):
        cart.shipping_info = info
        cart.save()

    def _get_info(self, cart):
        return cart.shipping_info


class CartUpdateMethodBaseStorefrontView(APIView, ABC):
    """
    Base view for updating cart's payment/shipping method country.
    Do not use this view directly, use inherited classes instead (and implement `_set_method` method)
    """

    @abstractmethod
    def _set_method(self, cart, id):
        """
        Set payment/shipping method country
        """
        pass

    def put(self, request, token, id):
        try:
            cart = Cart.objects.get(token=token)
            self._set_method(cart, id)

            return Response(status=HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
class CartUpdateShippingMethodStorefrontView(CartUpdateMethodBaseStorefrontView):
    """
    View for updating cart's shipping method country
    """

    def _set_method(self, cart, id):
        cart.shipping_method_country = ShippingMethodCountry.objects.get(id=id)
        cart.save()


@permission_classes([AllowAny])
class CartUpdatePaymentMethodStorefrontView(CartUpdateMethodBaseStorefrontView):
    """
    View for updating cart's shipping method country
    """

    def _set_method(self, cart, id):
        cart.payment_method_country = PaymentMethodCountry.objects.get(id=id)
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

    serializer_class = PaymentMethodSerializer
    queryset = PaymentMethod.objects.all()

    @check_user_is_staff_decorator()
    def get(self, request):
        return super().get(request)


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

    serializer_class = PaymentMethodDetailSerializer

    parser_classes = [MultiPartParser, FormParser, JSONParser]

    lookup_field = "id"
    lookup_url_kwarg = "id"

    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)

    def get_queryset(self):
        return PaymentMethod.objects.all()


class PaymentMethodCountryListView(ListCreateAPIView):
    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]

    serializer_class = PaymentMethodCountrySerializer

    @check_user_is_staff_decorator()
    def get(self, request, method_id):
        return super().get(request, method_id)

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

    serializer_class = PaymentMethodCountrySerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)

    def get_queryset(self):
        return PaymentMethodCountry.objects.all()


class PaymentMethodCountryFullListView(ListCreateAPIView):
    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
    ]

    serializer_class = PaymentMethodCountryFullSerializer
    queryset = PaymentMethodCountry.objects.all()

    @check_user_is_staff_decorator()
    def get(self, request):
        return super().get(request)


class ShippingMethodListDashboardView(ListCreateAPIView):
    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]

    serializer_class = ShippingMethodSerializer
    queryset = ShippingMethod.objects.all()

    @check_user_is_staff_decorator()
    def get(self, request):
        return super().get(request)


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

    serializer_class = ShippingMethodDetailSerializer

    parser_classes = [MultiPartParser, FormParser, JSONParser]

    lookup_field = "id"
    lookup_url_kwarg = "id"

    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)

    def get_queryset(self):
        return ShippingMethod.objects.all()


class ShippingMethodCountryListView(ListCreateAPIView):
    permission_classes = (AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]

    serializer_class = ShippingMethodCountrySerializer

    @check_user_is_staff_decorator()
    def get(self, request, method_id):
        return super().get(request, method_id)

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

    serializer_class = ShippingMethodCountrySerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)

    def get_queryset(self):
        return ShippingMethodCountry.objects.all()

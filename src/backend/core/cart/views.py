from abc import ABC, abstractmethod

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import permission_classes
from rest_framework.generics import GenericAPIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.mixins import UpdateModelMixin, DestroyModelMixin
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
    HTTP_200_OK,
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
    CartItemAddSerializer,
    ShippingMethodSerializer,
    ShippingMethodDetailSerializer,
    ShippingMethodCountrySerializer,
    PaymentMethodSerializer,
    PaymentMethodDetailSerializer,
    PaymentMethodCountrySerializer,
    PaymentMethodCountryFullSerializer,
    CartTokenSerializer,
    CartItemUpdateSerializer,
    CartShippingMethodCountrySerializer,
    CartSerializer,
    CartDetailSerializer,
    CartPaymentMethodCountrySerializer,
    CartShippingMethodCountryBaseSerializer,
)
from country.models import (
    Country,
)
from country.serializers import (
    BillingInfoSerializer,
    ShippingInfoSerializer,
)
from product.models import ProductVariant, ProductPrice
from roles.decorator import check_user_is_staff_decorator, check_user_access_decorator


@permission_classes([AllowAny])  # TODO: use authentication
class CartDetailShortStorefrontView(GenericAPIView):
    def get(self, request, token):
        cart = Cart.objects.get(token=token)
        serializer = CartDetailSerializer(cart)
        return Response(serializer.data)


@permission_classes([AllowAny])  # TODO: use authentication
class CartDetailStorefrontView(APIView):
    """
    View used for getting cart detail and adding items into cart
    """

    def _get_cart(self, token):
        return Cart.objects.get(token=token)

    def get(self, request, token):
        cart = self._get_cart(token)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request, token):
        try:
            serializer = CartItemAddSerializer(data=request.data)
            if serializer.is_valid():
                update_data = serializer.save()

                cart = self._get_cart(token)
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
                    unit_price_without_vat=price.price
                    if not price.discount
                    else price.discounted_price,
                    unit_price_incl_vat=price.price_incl_vat(vat)
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
        user = request.user
        if user is not None and not user.is_anonymous:
            cart.user = user
        cart.save()
        if not request.data:
            serializer = CartTokenSerializer(cart)
            return Response(serializer.data)
        try:
            print(request.data)
            item_serializer = CartItemAddSerializer(data=request.data)
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
                    unit_price_without_vat=price.price
                    if not price.discount
                    else price.discounted_price,
                    unit_price_incl_vat=price.price_incl_vat(vat)
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


class CartUpdateQuantityBaseView(APIView):
    """
    Base view for updating cart items quantity.
    Do not use it directly, use inherited views instead
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


class CartUpdateQuantityDashboardView(CartUpdateQuantityBaseView):
    @check_user_access_decorator({"cart_change_permission"})
    def put(self, request, token):
        return super().put(request, token)


@permission_classes([AllowAny])
class CartUpdateQuantityStorefrontView(CartUpdateQuantityBaseView):
    def put(self, request, token):
        return super().put(request, token)


class CartInfoBaseView(APIView, ABC):
    """
    Base view for getting & updating cart's billing/shipping info
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

    def get(self, request, token):
        try:
            cart = Cart.objects.get(token=token)
            info = self._get_info(cart)
            serializer = self.info_serializer(info)
            return Response(status=HTTP_200_OK, data=serializer.data)
        except Cart.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)

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
                info = serializer.save()
                self._set_info(cart, info)
                return Response(status=HTTP_204_NO_CONTENT)
            print(serializer.errors)
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        except Cart.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)


class CartBillingInfoBaseView(CartInfoBaseView):
    """
    Base view for updating cart's billing info
    """

    info_serializer = BillingInfoSerializer

    def _set_info(self, cart, info):
        cart.billing_info = info
        cart.save()

    def _get_info(self, cart):
        return cart.billing_info


class CartShippingInfoBaseView(CartInfoBaseView):
    """
    Base view for updating cart's shipping info
    """

    info_serializer = ShippingInfoSerializer

    def _set_info(self, cart, info):
        cart.shipping_info = info
        cart.save()

    def _get_info(self, cart):
        return cart.shipping_info


@permission_classes([AllowAny])
class CartBillingInfoStorefrontView(CartBillingInfoBaseView):
    def get(self, request, token):
        return super().get(request, token)

    def put(self, request, token):
        return super().put(request, token)


@permission_classes([AllowAny])
class CartShippingInfoStorefrontView(CartShippingInfoBaseView):
    def get(self, request, token):
        return super().get(request, token)

    def put(self, request, token):
        return super().put(request, token)


class CartBillingInfoDashboardView(CartBillingInfoBaseView):
    @check_user_is_staff_decorator()
    def get(self, request, token):
        return super().get(request, token)

    @check_user_access_decorator({"order_change_permission"})
    def put(self, request, token):
        return super().put(request, token)


class CartShippingInfoDashboardView(CartShippingInfoBaseView):
    @check_user_is_staff_decorator()
    def get(self, request, token):
        return super().get(request, token)

    @check_user_access_decorator({"order_change_permission"})
    def put(self, request, token):
        return super().put(request, token)


@permission_classes([AllowAny])
class CartCountryMethodsStorefrontView(GenericAPIView):
    serializer_class = CartShippingMethodCountrySerializer

    def get_queryset(self):
        return ShippingMethodCountry.objects.filter(
            country=self.country,
            is_active=True,
        )

    def get(self, request, country_code):
        try:
            self.country = Country.objects.get(code=country_code)
            serializer = self.get_serializer(self.get_queryset(), many=True)
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
class MethodCountryDetailBaseView(GenericAPIView):
    """
    Base view for getting detailed info about payment/shipping method country

    Do not use this view directly, use inherited views instead
    """

    entity_class = None
    serializer_detail = None

    def get(self, request, id):
        try:
            method_country = self.entity_class.objects.get(id=id)
            serializer = self.serializer_detail(
                method_country, context={"request": request}
            )
            return Response(serializer.data)
        except (ShippingMethodCountry.DoesNotExist, PaymentMethodCountry.DoesNotExist):
            return Response(status=HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
class CartSelectedShippingMethodCountryStorefrontView(MethodCountryDetailBaseView):
    """
    View for getting cart's selected shipping method country
    """

    serializer_detail = CartShippingMethodCountryBaseSerializer
    entity_class = ShippingMethodCountry

    def get(self, request, token):
        try:
            cart = Cart.objects.get(token=token)
            return super().get(request, cart.shipping_method_country_id)
        except Cart.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
class CartSelectedPaymentMethodCountryStorefrontView(MethodCountryDetailBaseView):
    """
    View for getting cart's selected payment method country
    """

    serializer_detail = CartPaymentMethodCountrySerializer
    entity_class = PaymentMethodCountry

    def get(self, request, token):
        try:
            cart = Cart.objects.get(token=token)
            return super().get(request, cart.payment_method_country_id)
        except Cart.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)


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


class CartItemDeleteBaseView(APIView):
    """
    Base View used for deleting cart items.
    Do not use it directly, rather use inherited classes
    """

    def delete(self, request, token, sku):
        try:
            cart = Cart.objects.get(token=token)
            cart_item = cart.cart_items.get(product_variant__sku=sku)

            cart_item.delete()

            return Response(status=HTTP_204_NO_CONTENT)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(status=HTTP_404_NOT_FOUND)


class CartItemDeleteDashboardView(CartItemDeleteBaseView):
    @check_user_access_decorator({"cart_change_permission"})
    def delete(self, request, token, sku):
        return super().delete(request, token, sku)


@permission_classes([AllowAny])
class CartItemDeleteStorefrontView(CartItemDeleteBaseView):
    def delete(self, request, token, sku):
        return super().delete(request, token, sku)


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


class PaymentMethodCountryDetailDashboardView(
    MethodCountryDetailBaseView, UpdateModelMixin, DestroyModelMixin
):
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

    serializer_detail = CartPaymentMethodCountrySerializer
    entity_class = PaymentMethodCountry

    def get_queryset(self):
        return PaymentMethodCountry.objects.all()

    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)

    @check_user_is_staff_decorator()
    def put(self, request, id):
        return super().update(request, id)

    @check_user_is_staff_decorator()
    def delete(self, request, id):
        return super().destroy(request, id)


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


class ShippingMethodCountryDetailDashboardView(
    MethodCountryDetailBaseView, UpdateModelMixin, DestroyModelMixin
):
    """
    Detail of shipping method country
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

    serializer_detail = CartShippingMethodCountryBaseSerializer
    entity_class = ShippingMethodCountry

    def get_queryset(self):
        return ShippingMethodCountry.objects.all()

    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)

    @check_user_is_staff_decorator()
    def put(self, request, id):
        return super().update(request, id)

    @check_user_is_staff_decorator()
    def delete(self, request, id):
        return super().destroy(request, id)

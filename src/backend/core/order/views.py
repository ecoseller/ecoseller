# from django.shortcuts import render

from rest_framework import permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart, CartItem
from cart.serializers import CartItemDetailSerializer
from .models import Order
from .serializers import OrderListSerializer

from roles.decorator import check_user_is_staff_decorator
from .models import Order
from .serializers import (
    OrderDetailSerializer,
    OrderListSerializer,
    OrderStatusSerializer,
)


class OrderDetailDashboardView(RetrieveAPIView):
    allowed_methods = ["GET", "PUT"]
    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderDetailSerializer
    lookup_field = "token"

    @check_user_is_staff_decorator()
    def get(self, request, token):
        return super().get(request, token)

    def put(self, request, token):
        try:
            order = Order.objects.get(token=token)
            serializer = OrderStatusSerializer(order, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(status=204)
            else:
                return Response(serializer.errors, status=400)
        except Order.DoesNotExist:
            return Response(status=404)

    def get_queryset(self):
        return Order.objects.all()


class OrderListDashboardView(ListAPIView):
    """
    View for listing orders on dashboard
    """

    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderListSerializer
    queryset = Order.objects.all().order_by("-create_at")

    @check_user_is_staff_decorator()
    def get(self, request):
        return super().get(request)


class OrderCreateStorefrontView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        cart_token = request.data.get("cart_token")
        try:
            cart = Cart.objects.get(token=cart_token)
        except Cart.DoesNotExist:
            return Response({"error": "Cart does not exist"}, status=400)

        order = Order.objects.create(cart=cart)
        return Response({"token": order.token}, status=201)


class OrderListStorefrontView(ListAPIView):
    """
    View for listing orders on storefront
    """

    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderListSerializer

    def get(self, request):
        user = request.user
        if user is None or not user.is_authenticated:
            return Response({"error": "User is not authenticated"}, status=400)
        orders = self.get_queryset(user)
        serializer = self.serializer_class(orders, many=True)
        return Response(serializer.data, status=200)

    def get_queryset(self, user_id):
        return Order.objects.filter(cart__user_id=user_id).order_by("-create_at")


class OrderItemsListStorefrontView(ListAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, token):
        user = request.user
        if user is None or not user.is_authenticated:
            return Response({"error": "User is not authenticated"}, status=400)
        try:
            order = Order.objects.get(token=token)
        except Order.DoesNotExist:
            return Response({"error": "Order does not exist"}, status=400)
        if order.cart.user != user:
            return Response({"error": "Order does not belong to user"}, status=400)
        cartItems = CartItem.objects.filter(cart=order.cart)
        print("CART ITEMS", cartItems)
        items = []
        for cartItem in cartItems:
            if cartItem.product is not None:
                serializedItem = CartItemDetailSerializer(cartItem)
                print("ITEMS", serializedItem.data)
                items.append(serializedItem.data)
        return Response({"items": items}, status=200)

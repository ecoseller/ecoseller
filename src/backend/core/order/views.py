# from django.shortcuts import render

from rest_framework import permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart
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

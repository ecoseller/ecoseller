# from django.shortcuts import render

from rest_framework import permissions
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart
from .models import Order
from .serializers import OrderBaseSerializer, OrderListSerializer


class OrderDetailDashboardView(RetrieveUpdateDestroyAPIView):
    allowed_methods = ["GET", "PUT", "DELETE"]
    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderBaseSerializer
    lookup_field = "token"

    def get_queryset(self):
        return Order.objects.all()


class OrderListDashboardView(ListAPIView):
    """
    View for listing orders on dashboard
    """
    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderListSerializer
    queryset = Order.objects.all()


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

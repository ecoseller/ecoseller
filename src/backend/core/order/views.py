# from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListAPIView

from cart.models import Cart

from .serializers import OrderSerializer
from .models import Order


class OrderDetailDashboardView(RetrieveUpdateDestroyAPIView):
    allowed_methods = ["GET", "PUT", "DELETE"]
    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderSerializer
    lookup_field = "token"

    def get_queryset(self):
        return Order.objects.all()


class OrderListDashboardView(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderSerializer
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

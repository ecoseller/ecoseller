# from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView

from cart.models import Cart

from .serializers import OrderSerializer
from .models import Order


class OrderDetailView(RetrieveUpdateDestroyAPIView):
    allowed_methods = ["GET", "PUT", "DELETE"]
    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderSerializer
    lookup_field = "token"

    def get_queryset(self):
        return Order.objects.all()


class OrderView(APIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    serializer_class = OrderSerializer

    def get(self, request):
        orders = self.get_queryset()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        cart_token = request.data.get("cart_token")
        try:
            cart = Cart.objects.get(token=cart_token)
        except Cart.DoesNotExist:
            return Response({"error": "Cart does not exist"}, status=400)

        order = Order.objects.create(cart=cart)
        return Response({"token": order.token}, status=201)

    def get_queryset(self):
        return Order.objects.all()

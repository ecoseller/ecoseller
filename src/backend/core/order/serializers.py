from rest_framework import serializers

from cart.serializers import CartSerializer
from .models import Order


class OrderDetailSerializer(serializers.ModelSerializer):
    cart = CartSerializer()

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["token", "create_at", "cart"]


class OrderListSerializer(serializers.ModelSerializer):
    """
    Serializer for Orders
    """

    class Meta:
        model = Order
        fields = ("token", "create_at", "status", "customer_email")


class OrderStatusSerializer(serializers.ModelSerializer):
    """
    Serializer used for updating status of an order
    """

    class Meta:
        model = Order
        fields = ("status",)

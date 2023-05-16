from rest_framework import serializers

from .models import Order


class OrderBaseSerializer(serializers.ModelSerializer):
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
        fields = ("token", "create_at", "status", "customer_name")

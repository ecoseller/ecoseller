from .models import Order, OrderStatus
from rest_framework import serializers
from enumchoicefield import EnumChoiceField


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["token", "create_at", "cart"]

    token = serializers.UUIDField(read_only=True)
    create_at = serializers.DateTimeField(read_only=True)
    status = EnumChoiceField(enum_class=OrderStatus)
    cart = serializers.UUIDField(read_only=True)

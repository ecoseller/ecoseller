from rest_framework import serializers

from cart.serializers import CartSerializer, CartItemDetailSerializer
from .models import Order, OrderItemComplaint


class OrderSubmitSerializer(serializers.Serializer):
    """
    Serializer for submitting an order
    """

    cart_token = serializers.CharField(max_length=100)
    marketing_flag = serializers.BooleanField(default=False)
    agreed_to_terms = serializers.BooleanField(default=False)


class OrderItemComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemComplaint
        fields = ("id", "type", "status", "description", "create_at")
        read_only_fields = ("id", "type", "description", "create_at")


class OrderItemSerializer(CartItemDetailSerializer):
    complaints = OrderItemComplaintSerializer(many=True)

    class Meta(CartItemDetailSerializer.Meta):
        # model = CartItem
        fields = CartItemDetailSerializer.Meta.fields + ("complaints",)


class OrderCartSerializer(CartSerializer):
    cart_items = OrderItemSerializer(many=True, read_only=True)

    class Meta(CartSerializer.Meta):
        pass
        # model = Cart
        # fields = CartSerializer.Meta.fields


class OrderDetailSerializer(serializers.ModelSerializer):
    cart = OrderCartSerializer()

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


class OrderItemComplaintCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemComplaint
        fields = ("cart_item", "order", "description", "type")

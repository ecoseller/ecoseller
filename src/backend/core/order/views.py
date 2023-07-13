# from django.shortcuts import render
from datetime import datetime, timedelta

from django.conf import settings
from rest_framework import permissions, status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from api.notifications.conf import (
    EventTypes,
)
from api.payments.api import PaymentResolver
from api.payments.conf import PaymentStatus
from cart.models import Cart, CartItem
from cart.serializers import CartItemDetailSerializer
from product.models import Product
from roles.decorator import check_user_is_staff_decorator, check_user_access_decorator
from .models import Order, OrderItemComplaint
from .serializers import (
    OrderDetailSerializer,
    OrderListSerializer,
    OrderStatusSerializer,
    OrderSubmitSerializer,
    OrderItemComplaintCreateSerializer,
    OrderItemComplaintSerializer,
)

NotificationsApi = settings.NOTIFICATIONS_API


class OrderDetailDashboardView(RetrieveAPIView):
    allowed_methods = ["GET", "PUT"]
    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderDetailSerializer
    lookup_field = "token"

    @check_user_is_staff_decorator()
    def get(self, request, token):
        return super().get(request, token)

    @check_user_access_decorator({"order_change_permission"})
    def put(self, request, token):
        try:
            print("CHANGING ORDER STATUS")
            print(request.data)
            order = Order.objects.get(token=token)
            serializer = OrderStatusSerializer(order, data=request.data)
            if serializer.is_valid():
                serializer.save()
                # check if status was changed to shipped
                if serializer.data["status"] == "SHIPPED":
                    print("SENDING NOTIFICATION")
                    # send notification to customer
                    NotificationsApi.notify(
                        EventTypes.REVIEW_SEND,
                        data={
                            "order_token": str(order.token),
                            "order": OrderDetailSerializer(order).data,
                        },
                    )
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


class OrderListTodayDashboardView(APIView):
    """
    View for listing orders on dashboard
    """

    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderListSerializer

    @check_user_is_staff_decorator()
    def get(self, request):
        try:
            orders = self.get_queryset()
            ordersTogether = len(orders)
            # get distributed revenue for each country
            # e.g. { 'DE': 100, 'AT': 200 }
            revenue = {}
            symbols = {}
            orders_count = {}
            for order in orders:
                currency_code = order.cart.pricelist.currency.code
                currency_symbol = order.cart.pricelist.currency.symbol
                if currency_code in revenue:
                    revenue[currency_code] += order.cart.total_items_price_incl_vat
                    orders_count[currency_code] += 1
                else:
                    revenue[currency_code] = order.cart.total_items_price_incl_vat
                    orders_count[currency_code] = 1
                    symbols[currency_code] = currency_symbol

            orders_count_obj = [
                {
                    "code": "",
                    "symbol": "",
                    "value": ordersTogether,
                }
            ]

            revenue_obj = []
            if len(revenue) > 0:
                revenue_obj = [
                    {
                        "code": currency_code,
                        "symbol": symbols[currency_code],
                        "value": revenue[currency_code],
                    }
                    for currency_code in revenue
                ]
            else:
                revenue_obj = [
                    {
                        "code": "",
                        "symbol": "",
                        "value": 0,
                    }
                ]

            average_order_value_obj = []
            if len(revenue) > 0:
                average_order_value_obj = [
                    {
                        "code": currency_code,
                        "symbol": symbols[currency_code],
                        "value": revenue[currency_code] / orders_count[currency_code],
                    }
                    for currency_code in revenue
                ]
            else:
                average_order_value_obj = [
                    {
                        "code": "",
                        "symbol": "",
                        "value": 0,
                    }
                ]

            average_items_per_order_obj = [
                {
                    "code": "",
                    "symbol": "",
                    "value": (
                        sum([order.cart.cart_items.count() for order in orders])
                        / ordersTogether
                        if ordersTogether
                        else 0
                    ),
                }
            ]

            # get CartItems from orders
            cart_items = CartItem.objects.filter(cart__order__in=orders)
            product_sell_count = {}
            for cart_item in cart_items:
                if cart_item.product.id in product_sell_count:
                    product_sell_count[cart_item.product.id] += cart_item.quantity
                else:
                    product_sell_count[cart_item.product.id] = cart_item.quantity

            top_selling_product = None
            if len(product_sell_count) > 0:
                top_selling_product = max(
                    product_sell_count, key=product_sell_count.get
                )
                top_selling_product = Product.objects.get(id=top_selling_product)

            top_selling_product = [
                (
                    {
                        "title": top_selling_product.title,
                        "media": top_selling_product.get_primary_photo().media.url
                        if top_selling_product.get_primary_photo()
                        else None,
                    }
                    if top_selling_product
                    else None
                )
            ]

            return Response(
                {
                    "orders_count": orders_count_obj,
                    "revenue": revenue_obj,
                    "average_order_value": average_order_value_obj,
                    "average_items_per_order": average_items_per_order_obj,
                    "top_selling_products": top_selling_product,
                    "daily_orders_count": [],
                },
                status=200,
            )
        except CartItem.DoesNotExist or Product.DoesNotExist:
            return Response(
                {
                    "orders_count": orders_count_obj,
                    "revenue": revenue_obj,
                    "average_order_value": average_order_value_obj,
                    "average_items_per_order": average_items_per_order_obj,
                    "top_selling_products": [],
                    "daily_orders_count": [],
                },
                status=200,
            )
        except Exception as e:
            print(e)
            return Response(status=400)

    def get_queryset(self):
        return Order.objects.filter(create_at__date=datetime.now().date()).order_by(
            "-create_at"
        )


class OrderListMonthDashboardView(ListAPIView):
    """
    View for listing orders on dashboard
    """

    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderListSerializer

    @check_user_is_staff_decorator()
    def get(self, request):
        try:
            orders = self.get_queryset()
            ordersTogether = len(orders)
            # get distributed revenue for each country
            # e.g. { 'DE': 100, 'AT': 200 }
            revenue = {}
            symbols = {}
            orders_count = {}
            for order in orders:
                currency_code = order.cart.pricelist.currency.code
                currency_symbol = order.cart.pricelist.currency.symbol
                if currency_code in revenue:
                    revenue[currency_code] += order.cart.total_items_price_incl_vat
                    orders_count[currency_code] += 1
                else:
                    revenue[currency_code] = order.cart.total_items_price_incl_vat
                    orders_count[currency_code] = 1
                    symbols[currency_code] = currency_symbol

            orders_count_obj = [
                {
                    "code": "",
                    "symbol": "",
                    "value": ordersTogether,
                }
            ]

            revenue_obj = []
            if len(revenue) > 0:
                revenue_obj = [
                    {
                        "code": currency_code,
                        "symbol": symbols[currency_code],
                        "value": revenue[currency_code],
                    }
                    for currency_code in revenue
                ]
            else:
                revenue_obj = [
                    {
                        "code": "",
                        "symbol": "",
                        "value": 0,
                    }
                ]

            average_order_value_obj = []
            if len(revenue) > 0:
                average_order_value_obj = [
                    {
                        "code": currency_code,
                        "symbol": symbols[currency_code],
                        "value": revenue[currency_code] / orders_count[currency_code],
                    }
                    for currency_code in revenue
                ]
            else:
                average_order_value_obj = [
                    {
                        "code": "",
                        "symbol": "",
                        "value": 0,
                    }
                ]

            average_items_per_order_obj = [
                {
                    "code": "",
                    "symbol": "",
                    "value": (
                        sum([order.cart.cart_items.count() for order in orders])
                        / ordersTogether
                        if ordersTogether
                        else 0
                    ),
                }
            ]

            cart_items = CartItem.objects.filter(cart__order__in=orders)
            product_sell_count = {}
            for cart_item in cart_items:
                if cart_item.product.id in product_sell_count:
                    product_sell_count[cart_item.product.id] += cart_item.quantity
                else:
                    product_sell_count[cart_item.product.id] = cart_item.quantity

            top_5_sellings_products = None
            if len(product_sell_count) > 0:
                top_5_sellings_products = sorted(
                    product_sell_count, key=product_sell_count.get, reverse=True
                )[:5]
                top_5_sellings_products = [
                    Product.objects.get(id=item) for item in top_5_sellings_products
                ]

            if top_5_sellings_products:
                top_5_sellings_products = [
                    {
                        "title": product.title,
                        "media": product.get_primary_photo().media.url
                        if product.get_primary_photo()
                        else None,
                    }
                    for product in top_5_sellings_products
                ]
            else:
                top_5_sellings_products = []

            # get daily orders count for past 30 days or 0 if no orders
            daily_orders_count = []
            for i in range(30):
                daily_orders_count.append(
                    orders.filter(
                        create_at__date=datetime.now().date() - timedelta(days=i)
                    ).count()
                )

            return Response(
                {
                    "orders_count": orders_count_obj,
                    "revenue": revenue_obj,
                    "average_order_value": average_order_value_obj,
                    "average_items_per_order": average_items_per_order_obj,
                    "top_selling_products": top_5_sellings_products,
                    "daily_orders_count": daily_orders_count,
                },
                status=200,
            )
        except CartItem.DoesNotExist or Product.DoesNotExist:
            return Response(
                {
                    "orders_count": orders_count_obj,
                    "revenue": revenue_obj,
                    "average_order_value": average_order_value_obj,
                    "average_items_per_order": average_items_per_order_obj,
                    "top_selling_products": [],
                    "daily_orders_count": daily_orders_count,
                },
                status=200,
            )
        except Exception as e:
            print(e)
            return Response(status=400)

    def get_queryset(self):
        return Order.objects.filter(
            create_at__date__gte=datetime.now().date() - timedelta(days=30)
        ).order_by("-create_at")


class OrderCreateStorefrontView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderSubmitSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        cart_token = serializer.validated_data["cart_token"]
        marketing_flag = serializer.validated_data["marketing_flag"]
        agreed_to_terms = serializer.validated_data["agreed_to_terms"]

        if not agreed_to_terms:
            return Response({"error": "You must agree to the terms"}, status=400)

        try:
            cart = Cart.objects.get(token=cart_token)
        except Cart.DoesNotExist:
            return Response({"error": "Cart does not exist"}, status=400)

        # validate cart
        try:
            cart.is_valid()
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=400)

        order = Order.objects.create(
            cart=cart, marketing_flag=marketing_flag, agreed_to_terms=agreed_to_terms
        )
        # deduct quantity from inventory
        for item in cart.cart_items.all():
            item.deduct_from_inventory()

        try:
            NotificationsApi.notify(
                event=EventTypes.ORDER_SAVE,
                data={
                    "order_token": str(order.token),
                    "customer_email": order.customer_email,
                    "order": OrderDetailSerializer(order).data,
                },
            )
        except Exception as e:
            print("NotificationApi Error", e)

        return Response({"token": order.token}, status=201)


class OrderDetailStorefrontView(APIView):
    """
    View for rendering order detail on storefront
    """

    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderDetailSerializer

    def get(self, request, token):
        try:
            order = Order.objects.get(token=token)
        except Order.DoesNotExist:
            return Response({"error": "Order does not exist"}, status=400)

        order_data = self.serializer_class(order).data
        payment_data = None
        if order.cart.payment_method_country.api_request:
            p = PaymentResolver(order=order)
            if p.status() == PaymentStatus.PAID:
                payment_data = {
                    "status": PaymentStatus.PAID.value,
                }
            else:
                payment_data = {
                    "status": PaymentStatus.PENDING.value,
                    "data": p.pay(),
                }
        return Response({"order": order_data, "payment": payment_data}, status=200)


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
        try:
            order = Order.objects.get(token=token)
        except Order.DoesNotExist:
            return Response({"error": "Order does not exist"}, status=400)
        cartItems = CartItem.objects.filter(cart=order.cart)
        print("CART ITEMS", cartItems)
        items = []
        for cartItem in cartItems:
            if cartItem.product is not None:
                serializedItem = CartItemDetailSerializer(cartItem)
                print("ITEMS", serializedItem.data)
                items.append(serializedItem.data)
        return Response({"items": items}, status=200)


class OrderItemComplaintStorefrontView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = OrderItemComplaintCreateSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()

            try:
                NotificationsApi.notify(
                    event=EventTypes.ORDER_ITEM_COMPLAINT_CREATED,
                    data={
                        "complaint_id": instance.id
                    },
                )
            except Exception as e:
                print("NotificationApi Error", e)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderItemComplaintDashboardView(APIView):

    @check_user_access_decorator({"order_change_permission"})
    def put(self, request, id):
        try:
            instance = OrderItemComplaint.objects.get(id)
            serializer = OrderItemComplaintSerializer(instance, request.data)
            if serializer.is_valid():
                serializer.save()

                try:
                    NotificationsApi.notify(
                        event=EventTypes.ORDER_ITEM_COMPLAINT_UPDATED,
                        data={
                            "complaint_id": id
                        },
                    )
                except Exception as e:
                    print("NotificationApi Error", e)

                return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except OrderItemComplaint.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

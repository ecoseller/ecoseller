from django.http import HttpResponse
from .email.order import (
    EmailOrderConfirmation,
)
from .email.review import (
    EmailOrderReview,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny

from order.models import Order


@permission_classes((AllowAny,))
class OrderConfirmation(APIView):
    def get(self, request, order_id, format=None):
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return Response({"status": "NOTFOUND"}, status=404)
        customer_email = order.customer_email
        email = EmailOrderConfirmation(order, [customer_email], use_rq=True)

        if request.GET.get("render", False):
            return HttpResponse(email.render_to_string())

        email.send()
        return Response({"status": "OK"}, status=status.HTTP_200_OK)


@permission_classes((AllowAny,))
class OrderReview(APIView):
    def get(self, request, order_id, format=None):
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return Response({"status": "NOTFOUND"}, status=404)
        customer_email = order.customer_email
        email = EmailOrderReview(order, [customer_email], use_rq=True)

        if request.GET.get("render", False):
            return HttpResponse(email.render_to_string())

        email.send()
        return Response({"status": "OK"}, status=status.HTTP_200_OK)

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response

from .serializers import ReviewSerializer
from .models import Review

from product.models import ProductVariant
from order.models import Order


class ReviewCreateStorefrontView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ReviewSerializer

    def post(self, request):
        product_id = request.data.get("product")
        order_id = request.data.get("order")
        try:
            product = ProductVariant.objects.get(sku=product_id)
            order = Order.objects.get(token=order_id)
        except ProductVariant.DoesNotExist:
            return Response(status=404)
        except Order.DoesNotExist:
            return Response(status=404)

        if order.status != "SHIPPED":
            return Response(status=403)

        if Review.objects.filter(product=product, order=order).exists():
            return Response(status=403)

        review = Review.objects.create(product=product, order=order)
        return Response({"token": review.token}, status=201)


class ReviewDetailView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ReviewSerializer

    def get(self, request, token):
        try:
            review = Review.objects.get(token=token)
            serializer = ReviewSerializer(review)
            return Response(serializer.data)
        except Review.DoesNotExist:
            return Response(status=404)

    def put(self, request, token):
        try:
            review = Review.objects.get(token=token)
            serializer = ReviewSerializer(review, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(status=204)
            else:
                return Response(serializer.errors, status=400)
        except Review.DoesNotExist:
            return Response(status=404)

    def delete(self, request, token):
        try:
            review = Review.objects.get(token=token)
            review.delete()
            return Response(status=204)
        except Review.DoesNotExist:
            return Response(status=404)


class ProductReviewListStorefrontView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ReviewSerializer

    def get(self, request, product_id):
        reviews = Review.objects.filter(product__sku=product_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

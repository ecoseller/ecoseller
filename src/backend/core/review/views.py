from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response

from order.models import OrderStatus

from .serializers import ReviewSerializer
from .models import Review

from product.models import ProductVariant, Product
from order.models import Order


class ReviewCreateStorefrontView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ReviewSerializer

    def post(self, request):
        product_id = request.data.get("product_id")
        product_variant_sku = request.data.get("product_variant_sku")
        order_id = request.data.get("order")
        rating = request.data.get("rating")
        comment = request.data.get("comment")

        try:
            product = Product.objects.get(id=product_id)
            product_variant = ProductVariant.objects.get(sku=product_variant_sku)
            order = Order.objects.get(token=order_id)
        except ProductVariant.DoesNotExist:
            return Response(status=404)
        except Order.DoesNotExist:
            return Response(status=404)

        if order.status != OrderStatus.SHIPPED:
            return Response(status=403)

        if Review.objects.filter(product_variant=product_variant, order=order).exists():
            return Response(status=403)

        review = Review.objects.create(
            product=product,
            order=order,
            rating=rating,
            comment=comment,
            product_variant=product_variant,
        )
        return Response(status=201)


class ReviewDetailDashboardView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ReviewSerializer

    def get(self, request, token):
        try:
            review = Review.objects.get(token=token)
            serializer = ReviewSerializer(review)
            return Response(serializer.data)
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


class ReviewListDashboardView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ReviewSerializer

    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

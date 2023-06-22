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
        country = request.data.get("country")

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

        Review.objects.create(
            product=product,
            order=order,
            rating=rating,
            comment=comment,
            product_variant=product_variant,
            country=country,
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

    def get(self, request, product_id, country):
        reviews = Review.objects.filter(product__id=product_id, country=country)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class ProductRatingDetailView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, product_id):
        reviews = Review.objects.filter(product__id=product_id)
        if len(reviews) == 0:
            return Response(
                {
                    "average_rating": 0,
                    "total_reviews": 0,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                },
                status=200,
            )
        average_rating = sum([r.rating for r in reviews]) / reviews.count()
        ten = reviews.filter(rating=10).count()
        twenty = reviews.filter(rating=20).count()
        thirty = reviews.filter(rating=30).count()
        forty = reviews.filter(rating=40).count()
        fifty = reviews.filter(rating=50).count()
        sixty = reviews.filter(rating=60).count()
        seventy = reviews.filter(rating=70).count()
        eighty = reviews.filter(rating=80).count()
        ninety = reviews.filter(rating=90).count()
        hundred = reviews.filter(rating=100).count()

        one = ten + twenty
        two = thirty + forty
        three = fifty + sixty
        four = seventy + eighty
        five = ninety + hundred

        return Response(
            {
                "average_rating": average_rating,
                "total_reviews": len(reviews),
                "1": one,
                "2": two,
                "3": three,
                "4": four,
                "5": five,
            },
            status=200,
        )


class ReviewListDashboardView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ReviewSerializer

    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

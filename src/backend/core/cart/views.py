from rest_framework.decorators import permission_classes
from rest_framework.generics import RetrieveAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_404_NOT_FOUND,
    HTTP_400_BAD_REQUEST,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
)
from rest_framework.views import APIView

from cart.models import Cart, CartItem
from cart.serializers import CartSerializer, CartItemUpdateSerializer
from product.models import ProductVariant, ProductPrice


@permission_classes([AllowAny])  # TODO: use authentication
class CartDetailStorefrontView(RetrieveAPIView, CreateModelMixin):
    """
    View used for getting cart detail and adding items into cart
    """

    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    lookup_field = "token"

    def post(self, request, token):
        try:
            serializer = CartItemUpdateSerializer(data=request.data)
            if serializer.is_valid():
                update_data = serializer.save()

                cart = Cart.objects.get(token=token)
                product_variant = ProductVariant.objects.get(sku=update_data.sku)

                price = ProductPrice.objects.get(
                    product_variant=product_variant, price_list__is_default=True
                )  # TODO: use selected pricelist

                cart_item = CartItem(
                    cart=cart,
                    product_variant=product_variant,
                    unit_price_gross=price.price,
                    unit_price_net=price.price,
                    quantity=update_data.quantity,
                )
                cart_item.save()

                return Response(status=HTTP_201_CREATED)
            return Response(status=HTTP_400_BAD_REQUEST)
        except (Cart.DoesNotExist, ProductVariant.DoesNotExist):
            return Response(status=HTTP_404_NOT_FOUND)
        except ProductPrice.DoesNotExist:
            return Response(status=HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])
class CartUpdateQuantityStorefrontView(APIView):
    """
    View for updating cart items quantity
    """

    def put(self, request, token):
        try:
            serializer = CartItemUpdateSerializer(data=request.data)
            if serializer.is_valid():
                update_data = serializer.save()
                cart = Cart.objects.get(token=token)
                cart_item = cart.cart_items.get(product_variant__sku=update_data.sku)

                cart_item.quantity = update_data.quantity
                cart_item.save()

                return Response(status=HTTP_204_NO_CONTENT)
            return Response(status=HTTP_400_BAD_REQUEST)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(status=HTTP_404_NOT_FOUND)


@permission_classes([AllowAny])
class CartItemDeleteStorefrontView(APIView):
    """
    View used for deleting cart items
    """

    def delete(self, request, token, sku):
        try:
            cart = Cart.objects.get(token=token)
            cart_item = cart.cart_items.get(product_variant__sku=sku)

            cart_item.delete()

            return Response(status=HTTP_204_NO_CONTENT)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(status=HTTP_404_NOT_FOUND)

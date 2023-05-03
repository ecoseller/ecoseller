from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.status import (
    HTTP_404_NOT_FOUND,
    HTTP_400_BAD_REQUEST,
    HTTP_204_NO_CONTENT,
)
from rest_framework.views import APIView

from cart.models import Cart, CartItem
from cart.serializers import CartSerializer, CartItemUpdateCountSerializer
from product.models import ProductVariant


@permission_classes([AllowAny])  # TODO: use authentication
class CartDetailStorefrontView(APIView):
    def get(self, request, token):
        try:
            cart = Cart.objects.get(token=token)
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)

    def post(self,request,token):


    def put(self, request, token):
        try:
            serializer = CartItemUpdateCountSerializer(data=request.data)
            if serializer.is_valid():
                update_data = serializer.save()
                cart = Cart.objects.get(token=token)
                cart_item = cart.cart_items.get(product_variant__sku=update_data.sku)

                cart_item.quantity = update_data.quantity
                cart_item.save()

                return Response(status=HTTP_204_NO_CONTENT)
            return Response(status=HTTP_400_BAD_REQUEST)
        except (Cart.DoesNotExist, CartItem.DoesNotExist) as e:
            print(e)
            return Response(status=HTTP_404_NOT_FOUND)

from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from cart.models import Cart
from cart.serializers import CartSerializer


@permission_classes([AllowAny])  # TODO: use authentication
class CartDetailStorefrontView(APIView):
    def get(self, request, pk):
        cart = Cart.objects.get(token=pk)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

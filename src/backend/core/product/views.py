from rest_framework.views import APIView
from rest_framework.response import Response


class ProductDetail(APIView):
    def get(self, request, id):
        return Response({"id": id})

    def put(self, request, id):
        raise NotImplementedError

    def delete(self, request, id):
        raise NotImplementedError

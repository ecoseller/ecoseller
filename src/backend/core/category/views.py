from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth.models import User


class CategoryView(APIView):
    """
    View for category related operations
    """

    def get(self, request, id):
        """
        Get category by its id
        """
        return Response({"id": id})

    def post(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass

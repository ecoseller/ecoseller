from rest_framework import mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from category.serializers import CategorySerializer
from category.models import Category


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryView(ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# @permission_classes([AllowAny])
# class CategoryView(APIView):
#     """
#     View for category related operations
#     """

#     def _get_by_id(id):
#         try:
#             Category.objects.get(id=id)
#         except:
#             raise Http

#     def get(self, request, id):
#         """
#         Get category by its id
#         """
#         return Response({"id": id})

#     def post(self, request, id):
#         """
#         Create new category
#         """
#         pass

#     def put(self, request, id):
#         """
#         Update category with the given id
#         """
#         pass

#     def delete(self, request, id):
#         """
#         Delete category with the given id
#         """
#         Category.objects

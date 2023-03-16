from rest_framework import mixins
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
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
from category.serializers import CategorySerializer, CategoryDetailSerializer
from category.models import Category


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryViewDashboard(APIView):
    def get(self, request):
        snippets = Category.objects.all()
        serializer = CategorySerializer(
            snippets, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def post(self, request):
        category_to_add = request.data
        category_to_add["parent"] = 1
        serializer = CategoryDetailSerializer(data=category_to_add)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryDetailViewDashboard(RetrieveUpdateDestroyAPIView):
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

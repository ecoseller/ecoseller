from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import RetrieveUpdateDestroyAPIView

# from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from category.serializers import (
    CategoryDetailSerializer,
    CategoryWithChildrenSerializer,
    CategoryRecoursiveSerializer,
)
from category.models import Category


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryViewDashboard(APIView):
    """
    View for listing all categories and adding new ones
    """

    def get(self, request):
        """
        Gets all published categories.
        Language-specific data are returned only in the selected language (set in `Accept-Language` header).
        If this header isn't present, Django app language is used instead.
        """
        categories = Category.objects.filter(
            parent=None
        )  # .all()  # filter(published=True)
        serializer = CategoryRecoursiveSerializer(
            categories, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def post(self, request):
        """
        Adds a new category
        """
        serializer = CategoryDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryDetailViewDashboard(RetrieveUpdateDestroyAPIView):
    """
    View for getting (by ID), updating and deleting categories.
    """

    queryset = Category.objects.all()
    serializer_class = CategoryDetailSerializer

    # def perform_destroy(self, instance):
    #     """
    #     Custom method for deletion.
    #     Marks the selected category as "not published".
    #     """
    #     instance.published = False
    #     instance.save()


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryChildrenViewDashboard(APIView):
    """
    View for for getting a category including its children categories
    """

    def get(self, request, id):
        """
        Get a category including its children
        """
        category = Category.objects.get(id=id)
        serializer = CategoryWithChildrenSerializer(category)
        return Response(serializer.data)

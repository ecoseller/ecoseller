# from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from rest_framework.generics import (
    RetrieveUpdateDestroyAPIView, RetrieveAPIView,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView

from category.models import Category
from category.serializers import (
    CategoryDetailDashboardSerializer,
    CategoryRecursiveDashboardSerializer, CategoryRecursiveStorefrontSerializer, CategoryDetailStorefrontSerializer,
)


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryDashboardView(APIView):
    """
    View for listing all categories and adding new ones.
    Used for dashboard.
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
        serializer = CategoryRecursiveDashboardSerializer(
            categories, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def post(self, request):
        """
        Adds a new category
        """
        serializer = CategoryDetailDashboardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@permission_classes([AllowAny])  # TODO: use authentication
class CategoryDetailDashboardView(RetrieveUpdateDestroyAPIView):
    """
    View for getting (by ID), updating and deleting categories.
    """

    queryset = Category.objects.all()
    serializer_class = CategoryDetailDashboardSerializer

    # def perform_destroy(self, instance):
    #     """
    #     Custom method for deletion.
    #     Marks the selected category as "not published".
    #     """
    #     instance.published = False
    #     instance.save()


@permission_classes([AllowAny])
class CategoryStorefrontView(APIView):
    """
    View for getting all categories.
    Used for storefront.
    """

    def get(self, request):
        """
        Gets all published categories for storefront.
        Language-specific data are returned only in the selected language (set in `Accept-Language` header).
        If this header isn't present, Django app language is used instead.
        """
        categories = Category.objects.filter(
            parent=None, published=True
        )
        serializer = CategoryRecursiveStorefrontSerializer(
            categories, many=True, context={"request": request}
        )
        return Response(serializer.data)


@permission_classes([AllowAny])
class CategoryDetailStorefrontView(RetrieveAPIView):
    """
    View for getting categories.
    Used for storefront.
    """

    queryset = Category.objects.filter(published=True)
    serializer_class = CategoryDetailStorefrontSerializer

# @permission_classes([AllowAny])  # TODO: use authentication
# class CategoryChildrenViewDashboard(APIView):
#     """
#     View for getting a category including its children categories
#     """
#
#     def get(self, request, id):
#         """
#         Get a category including its children
#         """
#         category = Category.objects.get(id=id)
#         serializer = CategoryWithChildrenSerializer(category)
#         return Response(serializer.data)

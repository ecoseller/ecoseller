from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import RetrieveUpdateDestroyAPIView

# from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from .models import (
    PageCategoryType,
    PageCategory,
    Page,
    PageFrontend,
    PageCMS,
)

from .serializers import (
    PagePolymorphicSerializer,
    PagePolymorphicPreviewSerializer,
    PageCategoryPreviewSerializer,
    PagePolymorphicDashboardSerializer,
    PageCMSDashboardSerializer,
    PageFrontendDashboardSerializer,
)


class PageDashboardView(APIView):
    """
    View for adding new page (CMS or Frontend) and listing all pages
    """

    permission_classes = (AllowAny,)
    authentication_classes = []

    def get(self, request):
        """
        Gets all pages.
        """
        pages = Page.objects.all()
        serializer = PagePolymorphicDashboardSerializer(pages, many=True)
        print(serializer.data)
        return Response(serializer.data)

    def post(self, request):
        """
        Adds a new page
        """
        serializer = PagePolymorphicDashboardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class PageFrontendDashboardDetailView(RetrieveUpdateDestroyAPIView):
    """
    View for getting (by ID), updating and deleting pages.
    """

    permission_classes = (AllowAny,)
    authentication_classes = []

    queryset = PageFrontend.objects.all()
    serializer_class = PageFrontendDashboardSerializer


class PageCMSDashboardDetailView(RetrieveUpdateDestroyAPIView):
    """
    View for getting (by ID), updating and deleting pages.
    """

    permission_classes = (AllowAny,)
    authentication_classes = []

    queryset = PageCMS.objects.all()
    serializer_class = PageCMSDashboardSerializer

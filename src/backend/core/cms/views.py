from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListAPIView
from django.db.models import Prefetch

from .models import (
    PageCategoryType,
    PageCategory,
    Page,
    PageFrontend,
    PageCMS,
)

from .serializers import (
    PagePolymorphicDashboardSerializer,
    PageCMSDashboardSerializer,
    PageFrontendDashboardSerializer,
    PageCategoryDashboardSerializer,
    PageCateogryTypeDashboardSerializer,
    PageCMSStorefrontSerializer,
    PageCategoryStorefrontPreviewSerializer,
)

from roles.decorator import check_user_is_staff_decorator


class PageDashboardView(APIView):
    """
    View for adding new page (CMS or Frontend) and listing all pages
    """

    permission_classes = (AllowAny,)

    @check_user_is_staff_decorator()
    def get(self, request):
        """
        Gets all pages.
        """

        pages = Page.objects.all().exclude(
            safe_deleted=True
        )  # even though we have a custom manager, we still need to exclude soft deleted objects here because of polymorphic
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
        print(serializer.errors)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class PageFrontendDashboardDetailView(RetrieveUpdateDestroyAPIView):
    """
    View for getting (by ID), updating and deleting pages.
    """

    permission_classes = (AllowAny,)

    @check_user_is_staff_decorator()
    def get(self, request, pk):
        return super().get(request, pk)

    queryset = PageFrontend.objects.all()
    serializer_class = PageFrontendDashboardSerializer


class PageCMSDashboardDetailView(RetrieveUpdateDestroyAPIView):
    """
    View for getting (by ID), updating and deleting pages.
    """

    permission_classes = (AllowAny,)

    @check_user_is_staff_decorator()
    def get(self, request, pk):
        return super().get(request, pk)

    queryset = PageCMS.objects.all()
    serializer_class = PageCMSDashboardSerializer


class PageCategoryDashboardView(APIView):
    """
    View for adding new page category and listing all categories
    """

    permission_classes = (AllowAny,)

    @check_user_is_staff_decorator()
    def get(self, request):
        """
        Gets all page category.
        """
        pages = PageCategory.objects.all()
        serializer = PageCategoryDashboardSerializer(pages, many=True)
        print(serializer.data)
        return Response(serializer.data)

    def post(self, request):
        """
        Adds a new page category.
        """
        serializer = PageCategoryDashboardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class PageCategoryDashboardDetailView(
    RetrieveUpdateDestroyAPIView,
):
    """
    View for getting (by ID), updating and deleting page categories.
    """

    permission_classes = (AllowAny,)

    @check_user_is_staff_decorator()
    def get(self, request, pk):
        return super().get(request, pk)

    queryset = PageCategory.objects.all()
    serializer_class = PageCategoryDashboardSerializer


class PageCategoryPagesDashboardView(APIView):
    """
    View for listing all pages in a category
    """

    permission_classes = (AllowAny,)

    def get(self, request, pk):
        """
        Gets all pages in a category.
        """
        raise NotImplementedError


class PageCategoryTypeDashboardView(APIView):
    """
    View for listing all page types
    """

    permission_classes = (AllowAny,)

    @check_user_is_staff_decorator()
    def get(self, request):
        """
        Gets all page types.
        """
        pages = PageCategoryType.objects.all()
        serializer = PageCateogryTypeDashboardSerializer(pages, many=True)
        print(serializer.data)
        return Response(serializer.data)

    def post(self, request):
        """
        Adds a new page type.
        """
        print(request.data)
        serializer = PageCateogryTypeDashboardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class PageTypeDashboardDetailView(RetrieveUpdateDestroyAPIView):
    """
    View for getting (by ID), updating and deleting page types.
    """

    permission_classes = (AllowAny,)

    @check_user_is_staff_decorator()
    def get(self, request, pk):
        return super().get(request, pk)

    queryset = PageCategoryType.objects.all()
    serializer_class = PageCateogryTypeDashboardSerializer


class PageTypePagesDashboardView(APIView):
    """
    View for listing all pages in a type
    """

    permission_classes = (AllowAny,)

    def get(self, request, pk):
        """
        Gets all pages in a type.
        """
        raise NotImplementedError


class PageCMSStorefrontDetailView(APIView):
    """
    Obtain page for storefront based on slug and locale
    """

    serializer_class = PageCMSStorefrontSerializer
    permission_classes = (AllowAny,)

    def get(self, request, locale, slug, *args, **kwargs):
        try:
            page = PageCMS.objects.get(
                translations__slug=slug, translations__language_code__iexact=locale
            )
        except PageCMS.DoesNotExist:
            return Response({"message": "page not found"}, status=HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(
            page, many=False, context={"request": request}
        )
        return Response(serializer.data)


class PageTypePagesStorefrontView(ListAPIView):
    """
    View for listing all pages in a type (frontend)
    """

    permission_classes = (AllowAny,)
    serializer_class = PageCategoryStorefrontPreviewSerializer

    def get_queryset(self):
        type = self.kwargs["type"]
        type_obj = PageCategoryType.objects.filter(identifier=type)
        return PageCategory.objects.filter(
            published=True, type__in=type_obj
        ).prefetch_related(
            Prefetch(
                "page",
                queryset=Page.objects.filter(published=True),
                to_attr="filtered_page",
            )
        )

    def get(self, request, type):
        """
        Gets all pages in a type.
        """
        queryset = self.get_queryset()
        print(queryset)
        serializer = self.serializer_class(
            queryset, many=True, context={"request": request}
        )
        data = serializer.data
        return Response(data)

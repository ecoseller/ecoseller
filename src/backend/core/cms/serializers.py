from parler_rest.serializers import TranslatableModelSerializer
from core.mixins import TranslatedSerializerMixin

from rest_polymorphic.serializers import PolymorphicSerializer
from rest_framework import serializers
from parler_rest.fields import TranslatedFieldsField
from .models import (
    PageCMS,
    PageFrontend,
    PageCategory,
    PageCategoryType,
)


class PageTypeSerializer(serializers.ModelSerializer):
    """
    Serializer used for PageType
    """

    class Meta:
        model = PageCategoryType
        fields = (
            "id",
            "identifier",
        )


class PageCategorySerializer(serializers.ModelSerializer):
    """
    Serializer used for PageCategory
    """

    class Meta:
        model = PageCategory
        fields = (
            "id",
            "title",
            "image",
            "code",
            "published",
        )


class PageCMSPreviewSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    """
    Serializer used for PageCMS preview (no content)
    """

    class Meta:
        model = PageCMS
        fields = (
            "id",
            "slug",
            "title",
        )


class PageCMSSerializer(PageCMSPreviewSerializer):
    """
    Serializer used for PageCMS detail (with content)
    """

    class Meta:
        model = PageCMS
        fields = (
            "id",
            "slug",
            "slugs",
            "title",
            "content",
        )


class PageCMSStorefrontSerializer(PageCMSSerializer):
    """
    Serializer used for PageCMS detail (with content)
    """

    class Meta:
        model = PageCMS
        fields = (
            "id",
            "slug",
            "title",
            "content",
        )


class PageFrontendSerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
    """
    Serializer used for PageFrontend (there's no need to distinguish preview and detail)
    """

    class Meta:
        model = PageFrontend
        fields = (
            "id",
            "frontend_path",
            "title",
        )


class PagePolymorphicSerializer(PolymorphicSerializer):
    """
    Serializer used for
    """

    model_serializer_mapping = {
        PageCMS: PageCMSSerializer,
        PageFrontend: PageFrontendSerializer,
    }


class PagePolymorphicPreviewSerializer(PolymorphicSerializer):
    """
    Serializer used for Page preview (no content)
    """

    model_serializer_mapping = {
        PageCMS: PageCMSPreviewSerializer,
        PageFrontend: PageFrontendSerializer,
    }


class PageCategoryPreviewSerializer(
    TranslatedSerializerMixin, serializers.ModelSerializer
):
    page = PagePolymorphicSerializer(source="filtered_page", many=True, read_only=True)

    class Meta:
        model = PageCategory
        fields = (
            "id",
            "title",
            "image",
            "code",
            "published",
            "page",
        )


class PageCMSDashboardSerializer(
    TranslatableModelSerializer, serializers.ModelSerializer
):
    translations = TranslatedFieldsField(shared_model=PageCMS, required=False)

    class Meta:
        model = PageCMS
        fields = (
            "id",
            "translations",
            "published",
            "categories",
        )


class PageFrontendDashboardSerializer(
    TranslatableModelSerializer,
    serializers.ModelSerializer,
):
    translations = TranslatedFieldsField(shared_model=PageFrontend, required=False)

    class Meta:
        model = PageFrontend
        fields = (
            "id",
            "translations",
            "frontend_path",
            "published",
            "categories",
        )


class PagePolymorphicDashboardSerializer(PolymorphicSerializer):
    """
    Serializer used for
    """

    model_serializer_mapping = {
        PageCMS: PageCMSDashboardSerializer,
        PageFrontend: PageFrontendDashboardSerializer,
    }


class PageCategoryDashboardSerializer(
    TranslatableModelSerializer,
    serializers.ModelSerializer,
):
    translations = TranslatedFieldsField(shared_model=PageCategory, required=False)
    code = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = PageCategory
        fields = ("id", "translations", "published", "code", "type")


class PageCateogryTypeDashboardSerializer(
    serializers.ModelSerializer,
):
    identifier = serializers.CharField(required=False)

    class Meta:
        model = PageCategoryType
        fields = ("id", "identifier")


class PageCategoryStorefrontPreviewSerializer(
    TranslatedSerializerMixin, serializers.ModelSerializer
):
    page = PagePolymorphicPreviewSerializer(
        source="filtered_page", many=True, read_only=True
    )

    class Meta:
        model = PageCategory
        fields = (
            "id",
            "title",
            "image",
            "code",
            "published",
            "page",
        )

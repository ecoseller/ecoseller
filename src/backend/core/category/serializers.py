from core.mixins import (
    TranslatedSerializerMixin,
)
from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
)
from category.models import (
    Category,
)
from parler_rest.serializers import (
    TranslatableModelSerializer,
    TranslatedFieldsField,
)


class CategorySerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Basic Category model serializer (see category/models.py)
    retrieving only one level of category without any parent or children.
    Only one translation is returned (see TranslatedSerializerMixin)
    """

    class Meta:
        model = Category
        fields = (
            "id",
            "published",
            "title",
            "meta_title",
            "meta_description",
            "description",
            "slug",
            "create_at",
            "update_at",
        )


class CategoryDetailSerializer(TranslatableModelSerializer, ModelSerializer):
    """
    Serializer for category detail.
    Language specific data are present in all languages (in `translations` field).
    """

    translations = TranslatedFieldsField(shared_model=Category)

    class Meta:
        model = Category
        fields = ("id", "published", "translations", "update_at", "create_at", "parent")


class CategoryWithChildrenSerializer(CategoryDetailSerializer):
    """
    Extension of CategoryDetailSerializer with children field.
    """

    children = SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            "id",
            "published",
            "translations",
            "update_at",
            "create_at",
            "parent",
            "children",
        )

    def get_children(self, obj):
        return [
            CategoryDetailSerializer(child).data for child in obj.published_children
        ]

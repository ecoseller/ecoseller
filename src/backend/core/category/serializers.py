from parler_rest.serializers import (
    TranslatableModelSerializer,
    TranslatedFieldsField,
)
from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
    Serializer,
    IntegerField,
    ListField,
)
from rest_framework_recursive.fields import RecursiveField

from category.models import (
    Category,
)
from core.mixins import (
    TranslatedSerializerMixin,
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


class CategoryRecursiveStorefrontSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Serializes categories into tree structure for storefront.
    Only one translation is returned (see TranslatedSerializerMixin)
    """

    children = RecursiveField(many=True, required=False, source="published_children")

    class Meta:
        model = Category
        fields = (
            "id",
            "title",
            "meta_title",
            "slug",
            "children",
        )


class CategoryDetailStorefrontSerializer(CategoryRecursiveStorefrontSerializer):
    """
    Serializer returning detailed data about category for storefront.
    Only one translation is returned (see TranslatedSerializerMixin)
    """

    breadcrumbs = SerializerMethodField()

    class Meta(CategoryRecursiveStorefrontSerializer.Meta):
        model = Category
        fields = CategoryRecursiveStorefrontSerializer.Meta.fields + (
            "description_editorjs",
            "meta_description",
            "breadcrumbs",
        )

    def get_breadcrumbs(self, obj):
        breadcrumbs = obj.get_ancestors(include_self=True)
        serializer = CategoryMinimalSerializer(
            breadcrumbs, many=True, context=self.context
        )
        return serializer.data


class CategoryRecursiveDashboardSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Serializes categories into tree structure for dashboard.
    Only one translation is returned (see TranslatedSerializerMixin)
    """

    children = RecursiveField(many=True, required=False, source="all_children")

    class Meta:
        model = Category
        fields = (
            "id",
            "title",
            "meta_title",
            "slug",
            "children",
            "published",
            "create_at",
            "update_at",
        )


class CategoryDetailDashboardSerializer(TranslatableModelSerializer, ModelSerializer):
    """
    Serializer returning detailed data about category for dashboard.
    Language specific data are present in all languages (in `translations` field).
    """

    translations = TranslatedFieldsField(shared_model=Category)

    class Meta:
        model = Category
        fields = ("id", "published", "translations", "update_at", "create_at", "parent")


# class CategoryWithChildrenSerializer(TranslatedSerializerMixin, ModelSerializer):
#     """
#     Extension of CategoryDetailSerializer with children field.
#     """
#
#     children = SerializerMethodField()
#
#     class Meta:
#         model = Category
#         fields = (
#             "id",
#             "title",
#             "description",
#             "meta_title",
#             "meta_description",
#             "slug",
#             "parent",
#             "children",
#         )
#
#     def get_children(self, obj):
#         return [
#             CategoryDetailSerializer(child).data for child in obj.published_children
#         ]


class CategoryMinimalSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Minimal serializer for Category model.
    """

    class Meta:
        model = Category
        fields = ("id", "title", "slug")


class TextualFilterSerializer(Serializer):
    id = IntegerField()
    selected_values_ids = ListField(child=IntegerField())


class NumericFilterSerializer(Serializer):
    id = IntegerField()
    min_value_id = IntegerField(allow_null=True)
    max_value_id = IntegerField(allow_null=True)


class SelectedFiltersSerializer(Serializer):
    textual = TextualFilterSerializer(many=True)
    numeric = NumericFilterSerializer(many=True)

    def create(self, validated_data):
        textual, numeric = [], []

        for filter in validated_data["textual"]:
            textual.append(TextualFilter(**filter))

        for filter in validated_data["numeric"]:
            numeric.append(NumericFilter(**filter))

        return SelectedFilters(textual, numeric)


class NumericFilter:
    def __init__(self, id, min_value_id, max_value_id):
        self.id, self.min_value_id, self.max_value_id = id, min_value_id, max_value_id


class TextualFilter:
    def __init__(self, id, selected_values_ids):
        self.id, self.selected_values_ids = id, selected_values_ids


class SelectedFilters:
    def __init__(self, textual, numeric):
        self.textual, self.numeric = textual, numeric

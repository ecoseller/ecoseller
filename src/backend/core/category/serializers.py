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
        )


class CategoryChildrenSerializer(CategorySerializer):
    """
    Extension of CategorySerializer with children field.
    """

    children = SerializerMethodField()

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
        )

    def get_children(self, obj):
        if "locale" in self.context:
            locale = self.context["locale"]
        return [
            CategorySerializer(x, context={"locale": locale}).data
            for x in obj.published_children
        ]

# articles/documents.py

from django_elasticsearch_dsl import Document, fields
from search.analyzers import (
    czech_autocomplete_hunspell_analyzer,
    slovak_autocomplete_hunspell_analyzer,
    general_autocomplete_hunspell_analyzer,
)
from django_elasticsearch_dsl.registries import registry
from django.conf import settings


from .models import (
    Product,
)

LANGUAGES = settings.PARLER_LANGUAGES[None]

language_bias_analyzers = {
    "cs": czech_autocomplete_hunspell_analyzer,
    "sk": slovak_autocomplete_hunspell_analyzer,
    "en": general_autocomplete_hunspell_analyzer,
    "default": general_autocomplete_hunspell_analyzer,
}


@registry.register_document
class ProductDocument(Document):
    id = fields.TextField()
    title = fields.ObjectField(
        properties={
            f"{lang['code']}": fields.TextField(
                analyzer=language_bias_analyzers[lang["code"]],
            )
            for lang in LANGUAGES
        }
    )
    short_description = fields.ObjectField(
        properties={
            f"{lang['code']}": fields.TextField(
                analyzer=language_bias_analyzers[lang["code"]],
            )
            for lang in LANGUAGES
        }
    )
    attribute_list = fields.ObjectField(
        properties={
            f"{lang['code']}": fields.TextField(
                analyzer=language_bias_analyzers[lang["code"]],
            )
            for lang in LANGUAGES
        }
    )

    class Index:
        name = "products"

    def get_queryset(self):
        """
        Used when the entire index for model is updated.
        """
        return self.django.model._default_manager.filter(published=True)

    class Django:
        model = Product

    def prepare_id(self, instance):
        return f"{instance.id}"

    def prepare_title(self, instance):
        title = {}

        for lang in LANGUAGES:
            title[lang["code"]] = instance.safe_translation_getter(
                "title", language_code=lang["code"]
            )
        return title

    def prepare_short_description(self, instance):
        short_description = {}

        for lang in LANGUAGES:
            short_description[lang["code"]] = instance.safe_translation_getter(
                "short_description", language_code=lang["code"]
            )
        return short_description

    def prepare_attribute_list(self, instance):
        attribute_list = {}

        for lang in LANGUAGES:
            attribute_list[lang["code"]] = ", ".join(
                instance.get_attribute_list(lang["code"])
            )
        return attribute_list

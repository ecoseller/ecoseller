from rest_framework.serializers import (
    ReadOnlyField,
)

from core.settings import PARLER_DEFAULT_LANGUAGE_CODE as DEFAULT_LANG


class TranslatedSerializerMixin(object):
    """
    Source of this source code:
    This code is based on issue of django-parler-rest package Serializer : Load only languages requested in headers
    https://github.com/django-parler/django-parler-rest/issues/26#issuecomment-974699332

    Get values without "translations" key.
    For selecting language; add "Accept-Language" into request header.
    There is no dependence to django-parler-rest library.

    Usage:

    class MyModel(models.Model):
        image = ...
        translations = TranslatedFields(
            name = models.CharField(...),
            description = models.TextField(...)
        )

    class MySerializer(TranslatedSerializerMixin, serializers.ModelSerializer):
        class Meta:
            model = MyModel
            fields = (
                'id',
                'image',
                'name',
                'description',
            )

    result:

    [
        {
            id: 1,
            image: '/images/001.png,
            name: '<value for the selected language>'
            description: '<value for the selected language>'
        },
        ...
    ]
    """

    def to_representation(self, instance):
        inst_rep = super().to_representation(instance)

        # use lang_code from Accept-Lanuage header if provided
        request = self.context.get("request")
        lang_code = request.META.get("HTTP_ACCEPT_LANGUAGE", None)

        # if no Accept-Lanuage header is provided, use Django app language
        if lang_code is None:
            lang_code = self.context.get("locale")

        # Only use the first two chars for language code
        if lang_code and "-" in lang_code:
            lang_code = lang_code.split("-")[0]

        result = {}
        translation_fields = self.get_translations_fields()
        translation_model = self.Meta.model._parler_meta.root_model
        translate = None
        # No need to get translate values while language is default
        if lang_code != DEFAULT_LANG:
            try:
                translate = translation_model.objects.get(
                    master=instance, language_code=lang_code
                )
            except Exception:
                print("No translation for language: %s" % lang_code)
                translate = None
                try:
                    # try to get translation for default language
                    translate = translation_model.objects.get(
                        master=instance, language_code=DEFAULT_LANG
                    )
                except Exception:
                    translate = None

        for field_name, field in self.get_fields().items():
            field_value = inst_rep.pop(field_name)
            if not field_value and isinstance(field, ReadOnlyField):
                field_value = ""

            if translate and field_name in translation_fields:
                field_value = getattr(translate, field_name)
                if field_value is None:
                    field_value = ""

            result[field_name] = field_value
        return result

    def get_translations_fields(self):
        """Return list of translate fields name"""
        return self.Meta.model._parler_meta.get_all_fields()

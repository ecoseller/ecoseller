from django.db import models
from django.conf import settings
from ckeditor.fields import RichTextField
from parler.models import TranslatableModel, TranslatedFields
from django_editorjs_fields import EditorJsJSONField
from mptt.models import MPTTModel
from mptt.fields import TreeForeignKey
from core.safe_delete import SafeDeleteModel
from api.notifications.conf import EventTypes


class Category(SafeDeleteModel, MPTTModel, TranslatableModel):
    parent = TreeForeignKey(
        "self", blank=True, null=True, related_name="children", on_delete=models.CASCADE
    )  # CASCADE when referenced category is deleted, delet all children
    translations = TranslatedFields(
        title=models.CharField(
            max_length=200, blank=True, help_text="Category title in given language"
        ),
        meta_title=models.CharField(
            max_length=200, blank=True, help_text="SEO Meta title in given language"
        ),
        meta_description=models.TextField(
            blank=True, help_text="SEO Meta description in given language"
        ),
        description=RichTextField(
            blank=True, null=True, help_text="Category description in given language"
        ),
        description_editorjs=EditorJsJSONField(
            blank=True,
            null=True,
            help_text="Main product description in given language in EditorJS format",
        ),
        slug=models.SlugField(
            max_length=200, null=False, help_text="Slug in given language"
        ),
    )
    published = models.BooleanField(default=False)

    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    @property
    def published_children(self):
        return self.get_children().filter(published=True)

    @property
    def all_children(self):
        return self.get_children()

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(
            force_insert=force_insert,
            force_update=force_update,
            using=using,
            update_fields=update_fields,
        )
        data = {
            "_model_class": self.__class__.__name__,
            "id": self.id,
            "parent_id": self.parent.id if self.parent is not None else None,
            "deleted": self.safe_deleted,
        }
        if self._state.adding:
            event = EventTypes.CATEGORY_SAVE
        elif self.safe_deleted:
            event = EventTypes.CATEGORY_DELETE
        else:
            event = EventTypes.CATEGORY_UPDATE
        settings.NOTIFICATIONS_API.notify(
            event,
            data=data,
        )

from django.db import models
from ckeditor.fields import RichTextField
from parler.models import TranslatableModel, TranslatedFields
from parler.managers import TranslatableQuerySet, TranslatableManager
from mptt.models import MPTTModel
from mptt.fields import TreeForeignKey


class Category(MPTTModel, TranslatableModel):
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

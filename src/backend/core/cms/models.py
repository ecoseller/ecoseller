from django.db import models
from polymorphic.models import PolymorphicModel
from parler.models import TranslatableModel, TranslatedFields
from django_editorjs_fields import EditorJsJSONField
from core.models import (
    SortableModel,
)
from .managers import PageManager
from core.safe_delete import SafeDeleteModel


def upload_page_category_image_location(instance, filename):
    filebase, extension = filename.split(".")
    return "cms/category/%s.%s" % (filebase, extension)


class PageCategoryType(SafeDeleteModel):
    identifier = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Page category type"
        verbose_name_plural = "Page category types"

    def __str__(self):
        return self.identifier


class PageCategory(SafeDeleteModel, TranslatableModel, SortableModel):
    published = models.BooleanField(default=False)
    type = models.ManyToManyField(PageCategoryType, blank=True)
    code = models.CharField(
        max_length=20,
    )
    translations = TranslatedFields(
        title=models.CharField(max_length=250),
    )
    ordering = models.IntegerField(default=0)
    image = models.FileField(
        upload_to=upload_page_category_image_location, null=True, blank=True
    )

    class Meta:
        verbose_name = "Page Category"
        verbose_name_plural = "Page Category"

    def get_ordering_queryset(self):
        return PageCategory.objects.none()

    # def __str__(self):
    #     return self.safe_translation_getter("title", any_language=True)


class Page(PolymorphicModel):
    # The shared base model
    categories = models.ManyToManyField(PageCategory, blank=True, related_name="page")
    published = models.BooleanField(default=False)
    ordering = models.IntegerField(default=0)
    recommended = models.BooleanField(default=False)

    def __str__(self):
        return str(self.get_real_instance())


class PageCMS(SafeDeleteModel, Page, TranslatableModel):
    """
    CMS Page model
    Holds title, slug and content
    """

    objects = PageManager()

    translations = TranslatedFields(
        slug=models.SlugField(unique=False, max_length=255),
        title=models.CharField(max_length=250),
        content=EditorJsJSONField(blank=True, null=True),
    )

    class Meta:
        verbose_name = "PageCMS"
        verbose_name_plural = "PagesCMS"

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True) or "--"


class PageFrontend(SafeDeleteModel, Page, TranslatableModel):
    """
    CMS Page model which has content on the frontend (storefront)
    so we store just title and frontend_path

    """

    objects = PageManager()

    translations = TranslatedFields(
        title=models.CharField(max_length=250),
    )
    frontend_path = models.CharField(
        max_length=250,
    )

    class Meta:
        verbose_name = "PageFrontend"
        verbose_name_plural = "PagesFrontend"

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True) or "--"

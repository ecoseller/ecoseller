from django.contrib import admin
from .models import (
    ProductVariant,
    Product,
    AttributeType,
    BaseAttribute,
    ExtAttributeType,
    ExtensionAttribute,
)


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = (
        "sku",
        "ean",
        "weight",
        "update_at",
        "create_at",
    )
    list_filter = (
        "update_at",
        "create_at",
    )
    search_fields = (
        "sku",
        "ean",
    )
    filter_horizontal = ("attributes",)


# class ProductVariantInline(admin.TabularInline):
#     model = Product.product_variants.through
#     extra = 0
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "published", "update_at", "create_at")
    list_filter = ("published", "category", "update_at", "create_at")
    search_fields = (
        "translations__title",
        "translations__meta_title",
        "translations__meta_description",
        "translations__short_description",
        "translations__description",
        "translations__slug",
    )
    filter_horizontal = ("product_variants",)
    # inlines = [ProductVariantInline,]

    # def get_prepopulated_fields(self, request, obj=None):
    #     # can't use `prepopulated_fields = ..` because it breaks the admin validation
    #     # for translated fields. This is the official django-parler workaround.
    #     return {
    #         'slug': ('title',)
    #     }


@admin.register(AttributeType)
class AttributeTypeAdmin(admin.ModelAdmin):
    list_display = ("type_name", "unit")
    search_fields = ("type_name", "unit")


@admin.register(BaseAttribute)
class BaseAttributeAdmin(admin.ModelAdmin):
    list_display = ("type", "value", "order")
    list_filter = ("type",)
    search_fields = ("type__type_name", "value")
    filter_horizontal = ("ext_attributes",)


@admin.register(ExtAttributeType)
class ExtAttributeTypeAdmin(admin.ModelAdmin):
    list_display = ("type_name", "unit")
    search_fields = ("type_name", "unit")


@admin.register(ExtensionAttribute)
class ExtensionAttributeAdmin(admin.ModelAdmin):
    list_display = (
        "type",
        "value",
    )
    list_filter = ("type",)
    search_fields = ("type__type_name", "value")
    filter_horizontal = ("ext_attributes",)

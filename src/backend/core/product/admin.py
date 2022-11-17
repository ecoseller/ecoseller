from django.contrib import admin
from product.models import *
from parler.admin import TranslatableAdmin, TranslatableModelForm, TranslatableTabularInline

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('sku', 'ean', 'weight', 'update_at', 'create_at', )
    list_filter = ('update_at', 'create_at', )
    search_fields = ('sku', 'ean',)

class ProductVariantInline(admin.TabularInline):
    model = Product.product_variants.through
    extra = 0
@admin.register(Product)
class ProductAdmin(TranslatableAdmin):
    list_display = ('id', 'title', 'category', 'published', 'update_at', 'create_at')
    list_filter = ('published', 'category', 'update_at', 'create_at')
    search_fields = ('translations__title', 'translations__meta_title', 'translations__meta_description', 'translations__short_description', 'translations__description', 'translations__slug')
    filter_horizontal = ('product_variants',)
    inlines = [ProductVariantInline,]

    def get_prepopulated_fields(self, request, obj=None):
        # can't use `prepopulated_fields = ..` because it breaks the admin validation
        # for translated fields. This is the official django-parler workaround.
        return {
            'slug': ('title',)
        }



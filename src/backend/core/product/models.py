from django.db import models
from parler.models import TranslatableModel, TranslatedFields
from ckeditor.fields import RichTextField
from category.models import (Category, )
from datetime import datetime

class ProductVariant(models.Model):
    ean = models.CharField(max_length=13, blank=True)
    sku = models.CharField(max_length=255, blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    update_at=models.DateTimeField(auto_now=True)
    create_at=models.DateTimeField(auto_now_add=True)
    # TODO:
    # product attributes (color, size, etc.)
    # filter attrbutes (color, size, material, etc)   

class Product(TranslatableModel):
    id = models.CharField(primary_key=True, max_length=20, unique=True)
    published = models.BooleanField(default=False)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL) # SET_NULL when category is deleted
    translations = TranslatedFields(
        title=models.CharField(max_length=200, blank=True, help_text='Product title in given language'),
        meta_title=models.CharField(max_length=200, blank=True, help_text='SEO Meta title in given language'),
        meta_description=models.TextField(blank=True, help_text='SEO Meta description in given language'),
        short_description=models.TextField(blank=True, null=True, help_text='Short description in given language'),
        description= RichTextField(blank=True, null=True, help_text='Main product description in given language'),
        slug = models.SlugField(max_length=200, null=False, help_text='Slug in given language'),
    )
    product_variants = models.ManyToManyField('ProductVariant', symmetrical=False, blank=True)
    update_at=models.DateTimeField(auto_now=True)
    create_at=models.DateTimeField(auto_now_add=True)
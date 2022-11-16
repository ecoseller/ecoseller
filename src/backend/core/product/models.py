from django.db import models
from parler.models import TranslatableModel, TranslatedFields
from ckeditor.fields import RichTextField
from category.models import (Category, )
from datetime import datetime

class ProductVariant(models.Model):
    sku = models.CharField(max_length=255, blank=True, primary_key=True, unique=True)
    ean = models.CharField(max_length=13, blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    update_at=models.DateTimeField(auto_now=True)
    create_at=models.DateTimeField(auto_now_add=True)
    attributes=models.ManyToManyField('BaseAttribute') 

    def __str__(self) -> str:
        return "sku: {} ean: {}".format(self.sku, self.ean)

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

    def __str__(self) -> str:
        return "id: {} title: {}".format(self.id, self.title)


# Attributes

class AttributeType(models.Model):
    type_name=models.CharField(max_length=200, blank=False, null=False, help_text='Type name of attribute (e.g. weight, size)')
    unit=models.CharField(max_length=200, blank=True, null=True, help_text='Unit of given type in which value is measured')

    def __str__(self) -> str:
        return "{} ({})".format(self.type_name, self.unit)

class BaseAttribute(models.Model):
    type=models.ForeignKey('AttributeType', on_delete=models.CASCADE)
    value=models.CharField(max_length=200, blank=False, null=False)
    order=models.IntegerField(blank=True, null=True)
    ext_attributes=models.ManyToManyField('ExtensionAttribute')

    def __str__(self) -> str:
        return "{}: {}".format(self.type.type_name, self.value)

class ExtAttributeType(models.Model):
    type_name=models.CharField(max_length=200, blank=False, null=False, help_text='Type name of attribute (e.g. weight, size)')
    unit=models.CharField(max_length=200, blank=True, null=True, help_text='Unit of given type in which value is measured')

    def __str__(self) -> str:
        return "{} ({})".format(self.type_name, self.unit)
class ExtensionAttribute(models.Model):
    type=models.ForeignKey('ExtAttributeType', on_delete=models.CASCADE)
    value=models.CharField(max_length=200, blank=False, null=False)
    ext_attributes=models.ManyToManyField("self", blank=True, symmetrical=False) 

    def __str__(self) -> str:
        return "{}: {}".format(self.type.type_name, self.value)
# Generated by Django 4.0.3 on 2023-03-27 16:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('category', '0002_category_create_at_category_published_and_more'),
        ('product', '0016_producttype_product_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='category.category'),
        ),
        migrations.AlterField(
            model_name='producttype',
            name='allowed_attribute_types',
            field=models.ManyToManyField(blank=True, to='product.attributetype'),
        ),
        migrations.AlterField(
            model_name='productvariant',
            name='attributes',
            field=models.ManyToManyField(blank=True, to='product.baseattribute'),
        ),
    ]

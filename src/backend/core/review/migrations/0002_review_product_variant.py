# Generated by Django 4.0.3 on 2023-06-18 20:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("product", "0038_attributetype_baseattribute_and_more"),
        ("review", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="review",
            name="product_variant",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="review",
                to="product.productvariant",
            ),
        ),
    ]

# Generated by Django 4.0.3 on 2023-06-16 12:04

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0044_alter_testmodeltranslation_unique_together_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="attributetype",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="baseattribute",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="pricelist",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="product",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="productmedia",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="productprice",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="producttype",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="productvariant",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="productvariantmedia",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
    ]

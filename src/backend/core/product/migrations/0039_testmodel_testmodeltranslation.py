# Generated by Django 4.0.3 on 2023-06-16 09:23

from django.db import migrations, models
import django.db.models.deletion
import parler.fields
import parler.models


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0038_attributetype_baseattribute_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="TestModel",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
            bases=(parler.models.TranslatableModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="TestModelTranslation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "language_code",
                    models.CharField(
                        db_index=True, max_length=15, verbose_name="Language"
                    ),
                ),
                ("name", models.CharField(max_length=128)),
                (
                    "master",
                    parler.fields.TranslationsForeignKey(
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="translations",
                        to="product.testmodel",
                    ),
                ),
            ],
            options={
                "verbose_name": "test model Translation",
                "db_table": "product_testmodel_translation",
                "db_tablespace": "",
                "managed": True,
                "default_permissions": (),
                "unique_together": {("language_code", "master")},
            },
            bases=(parler.models.TranslatedFieldsModelMixin, models.Model),
        ),
    ]

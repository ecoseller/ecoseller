# Generated by Django 4.0.3 on 2023-05-29 14:00

from django.db import migrations, models
import django.db.models.deletion
import parler.fields
import parler.models


class Migration(migrations.Migration):

    dependencies = [
        ("product", "0037_remove_baseattribute_ext_attributes_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="AttributeType",
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
                    "type_name",
                    models.CharField(
                        blank=True,
                        help_text="Type name of attribute (e.g. weight, size)",
                        max_length=200,
                        null=True,
                    ),
                ),
                (
                    "unit",
                    models.CharField(
                        blank=True,
                        help_text="Unit of given type in which value is measured",
                        max_length=200,
                        null=True,
                    ),
                ),
                (
                    "value_type",
                    models.CharField(
                        choices=[
                            ("TEXT", "Value is represented as a text"),
                            ("INTEGER", "Value is represented as an integer"),
                            ("DECIMAL", "Value is represented as a decimal"),
                        ],
                        default="TEXT",
                        max_length=10,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
            bases=(parler.models.TranslatableModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="BaseAttribute",
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
                ("value", models.CharField(blank=True, max_length=200, null=True)),
                ("order", models.IntegerField(blank=True, null=True)),
                (
                    "ext_attributes",
                    models.ManyToManyField(blank=True, to="product.extensionattribute"),
                ),
                (
                    "type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="base_attributes",
                        to="product.attributetype",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
            bases=(parler.models.TranslatableModelMixin, models.Model),
        ),
        migrations.AddField(
            model_name="producttype",
            name="allowed_attribute_types",
            field=models.ManyToManyField(blank=True, to="product.attributetype"),
        ),
        migrations.AddField(
            model_name="productvariant",
            name="attributes",
            field=models.ManyToManyField(blank=True, to="product.baseattribute"),
        ),
        migrations.CreateModel(
            name="BaseAttributeTranslation",
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
                (
                    "name",
                    models.CharField(
                        blank=True,
                        help_text="Base Attribute in given language",
                        max_length=200,
                    ),
                ),
                (
                    "master",
                    parler.fields.TranslationsForeignKey(
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="translations",
                        to="product.baseattribute",
                    ),
                ),
            ],
            options={
                "verbose_name": "base attribute Translation",
                "db_table": "product_baseattribute_translation",
                "db_tablespace": "",
                "managed": True,
                "default_permissions": (),
                "unique_together": {("language_code", "master")},
            },
            bases=(parler.models.TranslatedFieldsModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="AttributeTypeTranslation",
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
                (
                    "name",
                    models.CharField(
                        blank=True,
                        help_text="Attribute type in given language",
                        max_length=200,
                    ),
                ),
                (
                    "master",
                    parler.fields.TranslationsForeignKey(
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="translations",
                        to="product.attributetype",
                    ),
                ),
            ],
            options={
                "verbose_name": "attribute type Translation",
                "db_table": "product_attributetype_translation",
                "db_tablespace": "",
                "managed": True,
                "default_permissions": (),
                "unique_together": {("language_code", "master")},
            },
            bases=(parler.models.TranslatedFieldsModelMixin, models.Model),
        ),
    ]

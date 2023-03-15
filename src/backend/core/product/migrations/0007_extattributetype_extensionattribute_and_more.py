# Generated by Django 4.0.3 on 2022-11-17 19:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0006_attributetype_baseattribute_attributeclothes_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="ExtAttributeType",
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
                        help_text="Type name of attribute (e.g. weight, size)",
                        max_length=200,
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
            ],
        ),
        migrations.CreateModel(
            name="ExtensionAttribute",
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
                ("value", models.CharField(max_length=200)),
                (
                    "ext_attributes",
                    models.ManyToManyField(
                        blank=True, null=True, to="product.extensionattribute"
                    ),
                ),
                (
                    "type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="product.extattributetype",
                    ),
                ),
            ],
        ),
        migrations.DeleteModel(
            name="AttributeClothes",
        ),
        migrations.AddField(
            model_name="baseattribute",
            name="order",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="baseattribute",
            name="ext_attributes",
            field=models.ManyToManyField(to="product.extensionattribute"),
        ),
    ]

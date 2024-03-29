# Generated by Django 4.0.3 on 2023-03-20 18:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0014_pricelist_create_at_pricelist_update_at"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductMedia",
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
                    "sort_order",
                    models.IntegerField(db_index=True, editable=False, null=True),
                ),
                ("media", models.ImageField(upload_to="product_media")),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("IMAGE", "An uploaded image or an URL to an image"),
                            ("VIDEO", "A URL to an external video"),
                        ],
                        default="IMAGE",
                        max_length=10,
                    ),
                ),
                ("alt", models.CharField(blank=True, max_length=128, null=True)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="product_media",
                        to="product.product",
                    ),
                ),
            ],
            options={
                "ordering": ["sort_order"],
            },
        ),
        migrations.AlterField(
            model_name="baseattribute",
            name="type",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="base_attributes",
                to="product.attributetype",
            ),
        ),
        migrations.AlterField(
            model_name="productprice",
            name="product_variant",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="price",
                to="product.productvariant",
            ),
        ),
        migrations.AlterField(
            model_name="productvariant",
            name="attributes",
            field=models.ManyToManyField(
                blank=True, null=True, to="product.baseattribute"
            ),
        ),
        migrations.CreateModel(
            name="ProductVariantMedia",
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
                    "media",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="product.productmedia",
                    ),
                ),
                (
                    "product_variant",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="product.productvariant",
                    ),
                ),
            ],
            options={
                "unique_together": {("product_variant", "media")},
            },
        ),
    ]

# Generated by Django 4.0.3 on 2023-05-09 07:50

from django.db import migrations, models
import django.db.models.deletion
import parler.fields
import parler.models


class Migration(migrations.Migration):

    dependencies = [
        ("country", "0012_vatgroup_is_default"),
        ("cart", "0003_cart_user"),
    ]

    operations = [
        migrations.CreateModel(
            name="PaymentMethod",
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
                    "image",
                    models.ImageField(
                        blank=True, null=True, upload_to="payment_method"
                    ),
                ),
                ("update_at", models.DateTimeField(auto_now=True)),
                ("create_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "abstract": False,
            },
            bases=(parler.models.TranslatableModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="ShippingMethod",
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
                    "image",
                    models.ImageField(
                        blank=True, null=True, upload_to="shipping_method"
                    ),
                ),
                ("update_at", models.DateTimeField(auto_now=True)),
                ("create_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "abstract": False,
            },
            bases=(parler.models.TranslatableModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="ShippingMethodCountry",
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
                ("price_gross", models.DecimalField(decimal_places=2, max_digits=10)),
                ("is_active", models.BooleanField(default=True)),
                ("update_at", models.DateTimeField(auto_now=True)),
                ("create_at", models.DateTimeField(auto_now_add=True)),
                (
                    "country",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="country.country",
                    ),
                ),
                (
                    "currency",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="country.currency",
                    ),
                ),
                (
                    "payment_methods",
                    models.ManyToManyField(blank=True, to="cart.paymentmethod"),
                ),
                (
                    "shipping_method",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="cart.shippingmethod",
                    ),
                ),
                (
                    "vat_group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="country.vatgroup",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PaymentMethodCountry",
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
                ("price_gross", models.DecimalField(decimal_places=2, max_digits=10)),
                ("is_active", models.BooleanField(default=True)),
                ("update_at", models.DateTimeField(auto_now=True)),
                ("create_at", models.DateTimeField(auto_now_add=True)),
                (
                    "country",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="country.country",
                    ),
                ),
                (
                    "currency",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="country.currency",
                    ),
                ),
                (
                    "payment_method",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="cart.paymentmethod",
                    ),
                ),
                (
                    "vat_group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="country.vatgroup",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ShippingMethodTranslation",
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
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "master",
                    parler.fields.TranslationsForeignKey(
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="translations",
                        to="cart.shippingmethod",
                    ),
                ),
            ],
            options={
                "verbose_name": "shipping method Translation",
                "db_table": "cart_shippingmethod_translation",
                "db_tablespace": "",
                "managed": True,
                "default_permissions": (),
                "unique_together": {("language_code", "master")},
            },
            bases=(parler.models.TranslatedFieldsModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="PaymentMethodTranslation",
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
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "master",
                    parler.fields.TranslationsForeignKey(
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="translations",
                        to="cart.paymentmethod",
                    ),
                ),
            ],
            options={
                "verbose_name": "payment method Translation",
                "db_table": "cart_paymentmethod_translation",
                "db_tablespace": "",
                "managed": True,
                "default_permissions": (),
                "unique_together": {("language_code", "master")},
            },
            bases=(parler.models.TranslatedFieldsModelMixin, models.Model),
        ),
    ]

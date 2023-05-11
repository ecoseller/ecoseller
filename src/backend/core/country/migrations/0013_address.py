# Generated by Django 4.0.3 on 2023-05-10 16:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("country", "0012_vatgroup_is_default"),
    ]

    operations = [
        migrations.CreateModel(
            name="Address",
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
                ("street", models.CharField(max_length=255)),
                ("city", models.CharField(max_length=255)),
                ("postal_code", models.CharField(max_length=255)),
                (
                    "country",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="country.country",
                    ),
                ),
            ],
        ),
    ]
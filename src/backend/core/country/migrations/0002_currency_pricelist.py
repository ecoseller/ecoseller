# Generated by Django 4.0.3 on 2023-02-15 10:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("country", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Currency",
            fields=[
                (
                    "code",
                    models.CharField(
                        max_length=3, primary_key=True, serialize=False, unique=True
                    ),
                ),
                ("symbol", models.CharField(max_length=3)),
                (
                    "symbol_position",
                    models.CharField(
                        choices=[("BEFORE", "BEFORE"), ("AFTER", "AFTER")],
                        default="after",
                        max_length=6,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PriceList",
            fields=[
                (
                    "code",
                    models.CharField(
                        max_length=200, primary_key=True, serialize=False, unique=True
                    ),
                ),
                ("rounding", models.BooleanField(default=False)),
                ("includes_vat", models.BooleanField(default=True)),
                (
                    "currency",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="country.currency",
                    ),
                ),
            ],
        ),
    ]

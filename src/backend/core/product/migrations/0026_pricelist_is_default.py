# Generated by Django 4.0.3 on 2023-05-03 07:32

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0025_attributetype_value_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="pricelist",
            name="is_default",
            field=models.BooleanField(default=False, unique=True),
        ),
    ]
# Generated by Django 4.0.3 on 2023-05-04 07:55

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0027_alter_pricelist_is_default"),
    ]

    operations = [
        migrations.AddField(
            model_name="productvariant",
            name="availability",
            field=models.IntegerField(default=0),
        ),
    ]

# Generated by Django 4.0.3 on 2023-06-22 20:06

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("review", "0002_review_product_variant"),
    ]

    operations = [
        migrations.AddField(
            model_name="review",
            name="country",
            field=models.CharField(max_length=255, null=True),
        ),
    ]

# Generated by Django 4.0.3 on 2023-06-02 12:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cart", "0023_shippingmethodcountry_api_request"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="shippingmethodcountry",
            name="api_request",
        ),
        migrations.AddField(
            model_name="paymentmethodcountry",
            name="api_request",
            field=models.CharField(blank=True, max_length=42, null=True),
        ),
    ]

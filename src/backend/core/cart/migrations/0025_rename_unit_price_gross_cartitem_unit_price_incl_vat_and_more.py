# Generated by Django 4.0.3 on 2023-06-15 15:49

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("cart", "0024_remove_shippingmethodcountry_api_request_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="cartitem",
            old_name="unit_price_gross",
            new_name="unit_price_incl_vat",
        ),
        migrations.RenameField(
            model_name="cartitem",
            old_name="unit_price_net",
            new_name="unit_price_without_vat",
        ),
    ]

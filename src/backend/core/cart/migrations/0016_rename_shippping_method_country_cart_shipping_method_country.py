# Generated by Django 4.0.3 on 2023-05-11 08:17

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("cart", "0015_cart_payment_method_country_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="cart",
            old_name="shippping_method_country",
            new_name="shipping_method_country",
        ),
    ]

# Generated by Django 4.0.3 on 2023-05-17 09:51

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("cart", "0021_cart_pricelist"),
        ("country", "0016_alter_billingaddress_user_alter_shippingaddress_user"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="BillingAddress",
            new_name="BillingInfo",
        ),
        migrations.RenameModel(
            old_name="ShippingAddress",
            new_name="ShippingInfo",
        ),
    ]

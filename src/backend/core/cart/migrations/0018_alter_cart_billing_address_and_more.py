# Generated by Django 4.0.3 on 2023-05-15 07:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("country", "0014_billingaddress_shippingaddress_and_more"),
        ("cart", "0017_alter_cart_token"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cart",
            name="billing_address",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="country.billingaddress",
            ),
        ),
        migrations.AlterField(
            model_name="cart",
            name="shipping_address",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="country.shippingaddress",
            ),
        ),
    ]

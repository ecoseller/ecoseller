# Generated by Django 4.0.3 on 2023-05-11 08:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("cart", "0014_alter_cart_billing_address_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="cart",
            name="payment_method_country",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="cart.paymentmethodcountry",
            ),
        ),
        migrations.AddField(
            model_name="cart",
            name="shippping_method_country",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="cart.shippingmethodcountry",
            ),
        ),
    ]
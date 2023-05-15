# Generated by Django 4.0.3 on 2023-05-15 07:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
<<<<<<< HEAD
        ("cart", "0018_alter_cart_billing_address_and_more"),
        ("country", "0014_billingaddress_shippingaddress_and_more"),
=======
        ('cart', '0018_alter_cart_billing_address_and_more'),
        ('country', '0014_billingaddress_shippingaddress_and_more'),
>>>>>>> 6568e0f (shipping/billing address with setter for cart)
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.DeleteModel(
<<<<<<< HEAD
            name="Address",
        ),
        migrations.AddField(
            model_name="shippingaddress",
            name="country",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="country.country"
            ),
        ),
        migrations.AddField(
            model_name="shippingaddress",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="billingaddress",
            name="country",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="country.country"
            ),
        ),
        migrations.AddField(
            model_name="billingaddress",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
=======
            name='Address',
        ),
        migrations.AddField(
            model_name='shippingaddress',
            name='country',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='country.country'),
        ),
        migrations.AddField(
            model_name='shippingaddress',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='billingaddress',
            name='country',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='country.country'),
        ),
        migrations.AddField(
            model_name='billingaddress',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
>>>>>>> 6568e0f (shipping/billing address with setter for cart)
        ),
    ]

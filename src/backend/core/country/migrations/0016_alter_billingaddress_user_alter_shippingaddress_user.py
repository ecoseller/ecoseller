# Generated by Django 4.0.3 on 2023-05-15 08:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
<<<<<<< HEAD
<<<<<<< HEAD
        ("country", "0015_delete_address_shippingaddress_country_and_more"),
=======
        ('country', '0015_delete_address_shippingaddress_country_and_more'),
>>>>>>> 6568e0f (shipping/billing address with setter for cart)
=======
        ("country", "0015_delete_address_shippingaddress_country_and_more"),
>>>>>>> 3884d78 (black)
    ]

    operations = [
        migrations.AlterField(
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3884d78 (black)
            model_name="billingaddress",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
<<<<<<< HEAD
        ),
        migrations.AlterField(
            model_name="shippingaddress",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
=======
            model_name='billingaddress',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='shippingaddress',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
>>>>>>> 6568e0f (shipping/billing address with setter for cart)
=======
        ),
        migrations.AlterField(
            model_name="shippingaddress",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
>>>>>>> 3884d78 (black)
        ),
    ]
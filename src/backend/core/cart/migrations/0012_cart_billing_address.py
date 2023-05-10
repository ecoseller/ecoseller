# Generated by Django 4.0.3 on 2023-05-10 16:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0013_address'),
        ('cart', '0011_alter_shippingmethodcountry_payment_methods'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='billing_address',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='country.address'),
        ),
    ]

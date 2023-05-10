# Generated by Django 4.0.3 on 2023-05-10 16:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0013_address'),
        ('cart', '0013_cart_shipping_address_alter_cart_billing_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='billing_address',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='country.address'),
        ),
        migrations.AlterField(
            model_name='cart',
            name='shipping_address',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='country.address'),
        ),
    ]

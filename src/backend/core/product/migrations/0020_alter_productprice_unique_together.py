# Generated by Django 4.0.3 on 2023-03-16 19:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0019_alter_productvariant_attributes'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='productprice',
            unique_together={('price_list', 'product_variant')},
        ),
    ]

# Generated by Django 4.0.3 on 2023-05-04 14:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0030_producttypevatgroup'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producttypevatgroup',
            name='product_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='vat_groups', to='product.producttype'),
        ),
    ]

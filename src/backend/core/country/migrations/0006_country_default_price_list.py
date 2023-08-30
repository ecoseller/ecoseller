# Generated by Django 4.0.3 on 2023-02-15 11:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0014_pricelist_create_at_pricelist_update_at"),
        ("country", "0005_currency_create_at_currency_update_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="country",
            name="default_price_list",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="product.pricelist",
            ),
        ),
    ]
# Generated by Django 4.0.3 on 2023-06-12 11:00

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("order", "0004_order_agreed_to_terms_order_marketing_flag"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="payment_id",
            field=models.CharField(
                help_text="Payment ID from payment gateway or bank",
                max_length=100,
                null=True,
            ),
        ),
    ]

# Generated by Django 4.0.3 on 2023-06-12 08:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("order", "0003_remove_order_paid_order_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="agreed_to_terms",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="order",
            name="marketing_flag",
            field=models.BooleanField(default=False),
        ),
    ]

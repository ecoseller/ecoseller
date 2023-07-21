# Generated by Django 4.0.3 on 2023-07-19 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("order", "0006_orderitemcomplaint"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="orderitemcomplaint",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
    ]
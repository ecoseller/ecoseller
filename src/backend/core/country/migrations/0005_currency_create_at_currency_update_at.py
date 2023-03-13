# Generated by Django 4.0.3 on 2023-02-15 10:57

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [
        ("country", "0004_delete_pricelist"),
    ]

    operations = [
        migrations.AddField(
            model_name="currency",
            name="create_at",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="currency",
            name="update_at",
            field=models.DateTimeField(auto_now=True),
        ),
    ]

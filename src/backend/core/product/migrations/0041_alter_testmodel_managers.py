# Generated by Django 4.0.3 on 2023-06-16 09:24

from django.db import migrations
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ("product", "0040_testmodel_safe_deleted"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="testmodel",
            managers=[
                ("manager", django.db.models.manager.Manager()),
            ],
        ),
    ]

# Generated by Django 4.0.3 on 2023-06-16 09:24

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0039_testmodel_testmodeltranslation"),
    ]

    operations = [
        migrations.AddField(
            model_name="testmodel",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
    ]

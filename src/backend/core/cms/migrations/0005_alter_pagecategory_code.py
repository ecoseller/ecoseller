# Generated by Django 4.0.3 on 2023-04-24 18:48

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("cms", "0004_alter_pagecategory_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="pagecategory",
            name="code",
            field=models.CharField(default="", max_length=20),
            preserve_default=False,
        ),
    ]

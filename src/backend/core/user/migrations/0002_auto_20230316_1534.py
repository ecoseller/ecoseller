# Generated by Django 4.0.3 on 2023-03-16 15:34

from django.db import migrations
from ..initial_data import populate_groups


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0001_initial"),
        ("roles", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(populate_groups),
    ]

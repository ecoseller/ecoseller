# Generated by Django 4.0.3 on 2023-03-27 09:46

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ManagerPermission",
            fields=[
                (
                    "name",
                    models.CharField(max_length=200, primary_key=True, serialize=False),
                ),
                ("model", models.CharField(max_length=200)),
                ("description", models.CharField(max_length=200)),
                ("type", models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name="ManagerGroup",
            fields=[
                (
                    "name",
                    models.CharField(max_length=200, primary_key=True, serialize=False),
                ),
                ("description", models.CharField(max_length=200)),
                ("permissions", models.ManyToManyField(to="roles.managerpermission")),
            ],
        ),
    ]

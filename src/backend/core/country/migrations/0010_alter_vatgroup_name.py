# Generated by Django 4.0.3 on 2023-05-05 07:45

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("country", "0009_vatgroup_country"),
    ]

    operations = [
        migrations.AlterField(
            model_name="vatgroup",
            name="name",
            field=models.CharField(max_length=200),
        ),
    ]
# Generated by Django 4.0.3 on 2023-05-04 07:57

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0006_alter_user_cart"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="cart",
        ),
    ]

# Generated by Django 4.0.3 on 2023-04-05 06:38

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0020_alter_productmedia_media"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="id",
            field=models.BigAutoField(
                auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
            ),
        ),
    ]

# Generated by Django 4.0.3 on 2022-11-18 16:12

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0007_extattributetype_extensionattribute_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="extensionattribute",
            name="ext_attributes",
            field=models.ManyToManyField(blank=True, to="product.extensionattribute"),
        ),
    ]

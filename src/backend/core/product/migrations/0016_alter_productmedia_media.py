# Generated by Django 4.0.3 on 2023-03-29 07:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0015_productmedia_alter_baseattribute_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productmedia',
            name='media',
            field=models.ImageField(upload_to='product_media_upload_path'),
        ),
    ]

# Generated by Django 4.0.3 on 2023-07-12 15:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0045_attributetype_safe_deleted_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baseattributetranslation',
            name='name',
            field=models.CharField(blank=True, help_text='Base Attribute in given language', max_length=200, null=True),
        ),
    ]

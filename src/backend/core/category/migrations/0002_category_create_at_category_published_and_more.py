# Generated by Django 4.0.3 on 2022-11-03 10:31

import ckeditor.fields
import datetime
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('category', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='create_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2022, 11, 3, 10, 31, 55, 347044, tzinfo=utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='category',
            name='published',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='category',
            name='update_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='category.category'),
        ),
        migrations.AlterField(
            model_name='categorytranslation',
            name='description',
            field=ckeditor.fields.RichTextField(blank=True, help_text='Category description in given language', null=True),
        ),
        migrations.AlterField(
            model_name='categorytranslation',
            name='title',
            field=models.CharField(blank=True, help_text='Category title in given language', max_length=200),
        ),
    ]

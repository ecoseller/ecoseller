# Generated by Django 4.0.3 on 2023-05-29 06:13

from django.db import migrations, models
import django.db.models.deletion
import parler.fields
import parler.models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0035_productprice_discount'),
    ]

    operations = [
        migrations.CreateModel(
            name='TranslatableAttributeType',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=(parler.models.TranslatableModelMixin, 'product.attributetype', models.Model),
        ),
        migrations.CreateModel(
            name='TranslatableBaseAttribute',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=(parler.models.TranslatableModelMixin, 'product.baseattribute', models.Model),
        ),
        migrations.CreateModel(
            name='TranslatableBaseAttributeTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language_code', models.CharField(db_index=True, max_length=15, verbose_name='Language')),
                ('name', models.CharField(blank=True, help_text='Base Attribute in given language', max_length=200)),
                ('master', parler.fields.TranslationsForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='product.translatablebaseattribute')),
            ],
            options={
                'verbose_name': 'translatable base attribute Translation',
                'db_table': 'product_translatablebaseattribute_translation',
                'db_tablespace': '',
                'managed': True,
                'default_permissions': (),
                'unique_together': {('language_code', 'master')},
            },
            bases=(parler.models.TranslatedFieldsModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name='TranslatableAttributeTypeTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language_code', models.CharField(db_index=True, max_length=15, verbose_name='Language')),
                ('name', models.CharField(blank=True, help_text='Attribute type in given language', max_length=200)),
                ('master', parler.fields.TranslationsForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='product.translatableattributetype')),
            ],
            options={
                'verbose_name': 'translatable attribute type Translation',
                'db_table': 'product_translatableattributetype_translation',
                'db_tablespace': '',
                'managed': True,
                'default_permissions': (),
                'unique_together': {('language_code', 'master')},
            },
            bases=(parler.models.TranslatedFieldsModelMixin, models.Model),
        ),
    ]

# Generated by Django 4.0.3 on 2023-05-29 13:59

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        (
            "product",
            "0036_translatableattributetype_translatablebaseattribute_and_more",
        ),
    ]

    operations = [
        migrations.RemoveField(
            model_name="baseattribute",
            name="ext_attributes",
        ),
        migrations.RemoveField(
            model_name="baseattribute",
            name="type",
        ),
        migrations.AlterUniqueTogether(
            name="translatableattributetypetranslation",
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name="translatableattributetypetranslation",
            name="master",
        ),
        migrations.AlterUniqueTogether(
            name="translatablebaseattributetranslation",
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name="translatablebaseattributetranslation",
            name="master",
        ),
        migrations.DeleteModel(
            name="TranslatableAttributeType",
        ),
        migrations.DeleteModel(
            name="TranslatableBaseAttribute",
        ),
        migrations.RemoveField(
            model_name="producttype",
            name="allowed_attribute_types",
        ),
        migrations.RemoveField(
            model_name="productvariant",
            name="attributes",
        ),
        migrations.DeleteModel(
            name="AttributeType",
        ),
        migrations.DeleteModel(
            name="BaseAttribute",
        ),
        migrations.DeleteModel(
            name="TranslatableAttributeTypeTranslation",
        ),
        migrations.DeleteModel(
            name="TranslatableBaseAttributeTranslation",
        ),
    ]

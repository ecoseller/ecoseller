# Generated by Django 4.0.3 on 2023-05-02 06:53

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0024_producttranslation_description_editorjs"),
    ]

    operations = [
        migrations.AddField(
            model_name="attributetype",
            name="value_type",
            field=models.CharField(
                choices=[
                    ("TEXT", "Value is represented as a text"),
                    ("INTEGER", "Value is represented as an integer"),
                    ("DECIMAL", "Value is represented as a decimal"),
                ],
                default="TEXT",
                max_length=10,
            ),
        ),
    ]

# Generated by Django 4.0.3 on 2023-06-16 12:00

from django.db import migrations, models
import django.db.models.manager


class Migration(migrations.Migration):
    dependencies = [
        ("category", "0003_categorytranslation_description_editorjs"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="category",
            managers=[
                ("_tree_manager", django.db.models.manager.Manager()),
            ],
        ),
        migrations.AddField(
            model_name="category",
            name="safe_deleted",
            field=models.BooleanField(default=False),
        ),
    ]

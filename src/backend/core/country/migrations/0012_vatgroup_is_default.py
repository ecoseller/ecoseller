# Generated by Django 4.0.3 on 2023-05-05 08:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0011_alter_vatgroup_rate'),
    ]

    operations = [
        migrations.AddField(
            model_name='vatgroup',
            name='is_default',
            field=models.BooleanField(default=False),
        ),
    ]

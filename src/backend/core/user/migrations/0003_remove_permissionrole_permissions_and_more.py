# Generated by Django 4.0.3 on 2023-03-20 11:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_auto_20230316_1534'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='permissionrole',
            name='permissions',
        ),
        migrations.RemoveField(
            model_name='user',
            name='permission_role',
        ),
        migrations.DeleteModel(
            name='Permission',
        ),
        migrations.DeleteModel(
            name='PermissionRole',
        ),
    ]

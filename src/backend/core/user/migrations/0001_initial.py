# Generated by Django 4.0.3 on 2022-12-07 18:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("cart", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Permission",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("permission", models.CharField(max_length=200, unique=True)),
                ("permission_level", models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name="PermissionRole",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("role", models.CharField(max_length=200, unique=True)),
                ("permissions", models.ManyToManyField(to="user.permission")),
            ],
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "email",
                    models.EmailField(max_length=40, primary_key=True, serialize=False),
                ),
                ("first_name", models.CharField(blank=True, max_length=40)),
                ("last_name", models.CharField(blank=True, max_length=40)),
                ("birth_date", models.DateField(blank=True, null=True)),
                ("is_active", models.BooleanField(default=True)),
                ("is_admin", models.BooleanField(default=False)),
                ("is_staff", models.BooleanField(default=False)),
                (
                    "cart",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="cart.cart",
                    ),
                ),
                (
                    "permission_role",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="user.permissionrole",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]

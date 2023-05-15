# Generated by Django 4.0.3 on 2023-05-15 07:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0013_address'),
    ]

    operations = [
        migrations.CreateModel(
            name='BillingAddress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=255)),
                ('surname', models.CharField(max_length=255)),
                ('street', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('postal_code', models.CharField(max_length=255)),
                ('company_name', models.CharField(blank=True, max_length=255, null=True)),
                ('company_id', models.CharField(blank=True, max_length=255, null=True)),
                ('vat_number', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'verbose_name': 'Billing Address',
                'verbose_name_plural': 'Billing Addresses',
            },
        ),
        migrations.CreateModel(
            name='ShippingAddress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=255)),
                ('surname', models.CharField(max_length=255)),
                ('street', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('postal_code', models.CharField(max_length=255)),
                ('email', models.EmailField(blank=True, max_length=255, null=True)),
                ('phone', models.CharField(blank=True, max_length=255, null=True)),
                ('additional_info', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Shipping Address',
                'verbose_name_plural': 'Shipping Addresses',
            },
        ),
        migrations.RemoveField(
            model_name='address',
            name='country',
        ),
    ]

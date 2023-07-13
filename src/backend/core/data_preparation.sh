#!/bin/sh
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py reset_sequences
python3 manage.py shell -c "from django.contrib.auth import get_user_model; from django.contrib.auth.models import Group; User = get_user_model(); User.objects.filter(email='admin@example.com').exists() or User.objects.create_superuser('admin@example.com', 'admin');"
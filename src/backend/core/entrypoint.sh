#!/bin/sh
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --noinput
python3 manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@example.com').exists() or User.objects.create_superuser('admin@example.com', 'admin')"
python3 manage.py runserver 0.0.0.0:8000

exec "$@"
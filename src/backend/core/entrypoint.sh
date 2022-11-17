#!/bin/sh
python3 manage.py makemigrations
python3 manage.py migrate
# python3 manage.py makemigrations CoreAPI # and other apps...
# python3 manage.py migrate CoreAPI # and other apps...
python3 manage.py collectstatic --noinput
python3 manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin')"
python3 manage.py runserver 0.0.0.0:8000

exec "$@"
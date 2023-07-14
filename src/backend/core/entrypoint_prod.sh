#!/bin/sh
gunicorn core.wsgi -c ./gunicorn/conf.py

exec "$@"
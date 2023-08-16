#!/bin/sh
python3 -u /usr/src/app/core/manage.py rqworker --with-scheduler high low default

exec "$@"
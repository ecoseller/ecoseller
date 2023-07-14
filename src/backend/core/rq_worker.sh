#!/bin/sh
python3 -u /usr/src/app/core/manage.py rqworker high low default

exec "$@"
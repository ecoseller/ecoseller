#!/bin/sh

set -e

python3 -m recommender_system.scripts.migrate

if [ "$1" = "DEMO" ]
then
  chmod +x import_data.sh
  sh import_data.sh
fi

if [ "$1" = "PRODUCTION" ] || [ "$1" = "DEMO" ]
then
  pip3 install gunicorn==20.1.0
  gunicorn "recommender_system.server.app:create_app()" --bind $RS_SERVER_HOST:$RS_SERVER_PORT
else
  python3 -m recommender_system.scripts.run_server
fi

exec "$@"
#!/bin/sh

set -e

python3 -m recommender_system.scripts.migrate
if [ "$1" = "IMPORT" ]
then
  chmod +x import_data.sh
  sh import_data.sh
fi
python3 -m recommender_system.scripts.run_server

exec "$@"
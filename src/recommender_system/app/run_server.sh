#!/bin/sh

set -e

python3 -m recommender_system.scripts.migrate
if [ $IMPORT_DATA="TRUE" ]
then
  chmod +x import_data.sh
  sh import_data.sh
fi
python3 -m recommender_system.scripts.run_server
#!/bin/sh

set -e

python3 -m recommender_system.scripts.migrate
python3 -m recommender_system.scripts.run_server
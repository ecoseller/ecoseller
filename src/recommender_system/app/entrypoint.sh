#!/bin/sh

set -e

python3 recommender_system/scripts/migrate.py
python3 recommender_system/scripts/run_server.py
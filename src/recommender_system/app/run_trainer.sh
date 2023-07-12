#!/bin/sh

set -e

python3 -m recommender_system.scripts.run_trainer

exec "$@"
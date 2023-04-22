#!/bin/sh

set -e

psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE DATABASE products;
    CREATE DATABASE feedback;
EOSQL
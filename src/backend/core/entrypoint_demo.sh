#!/bin/sh
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -p $POSTGRES_PORT -a -f /usr/src/demo-data/sql/mock_data.sql

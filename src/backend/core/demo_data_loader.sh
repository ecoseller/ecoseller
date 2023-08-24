#!/bin/sh
cd /usr/src/
git clone https://github.com/ecoseller/demo-data.git
mv /usr/src/demo-data/media /usr/src/mediafiles
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -p $POSTGRES_PORT -a -f /usr/src/demo-data/sql/mock_data.sql

#!/bin/sh

echo "Importing data..."
apt-get install -y git postgresql-client
git clone https://github.com/ecoseller/demo-data.git
mv ./demo-data/ /usr/src/demo-data
psql $RS_PRODUCT_DB_URL -a -f /usr/src/demo-data/sql/mock_data_rs_products.sql
psql $RS_FEEDBACK_DB_URL -a -f /usr/src/demo-data/sql/mock_data_rs_feedback.sql

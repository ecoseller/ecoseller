#!/bin/sh

PRODUCTS_FILE=./demo-data/sql/mock_data_rs_products.sql
FEEDBACK_FILE=./demo-data/sql/mock_data_rs_feedback.sql

if [ -f "$PRODUCTS_FILE" ] && [ -f "$FEEDBACK_FILE" ]
then
  echo "Importing data..."
  psql $RS_PRODUCT_DB_URL -a -f $PRODUCTS_FILE
  psql $RS_FEEDBACK_DB_URL -a -f $FEEDBACK_FILE
  rm $PRODUCTS_FILE
  rm $FEEDBACK_FILE
else
  echo "Skipping data import..."
fi

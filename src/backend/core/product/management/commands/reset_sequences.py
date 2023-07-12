"""
Script to reset sequences in Postgres which normally occur due to importing/restoring a DB
https://stackoverflow.com/a/63364323/16587316
"""

import psycopg2
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connections


def dictfetchall(cursor):
    """Return all rows from a cursor as a dict"""
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


class Command(BaseCommand):
    help = "Resets sequencing errors in Postgres which normally occur due to importing/restoring a DB"

    def handle(self, *args, **options):
        # loop over all databases in system to figure out the tables that need to be reset
        for (
            name_to_use_for_connection,
            connection_settings,
        ) in settings.DATABASES.items():
            db_name = connection_settings["NAME"]
            host = connection_settings["HOST"]
            user = connection_settings["USER"]
            port = connection_settings["PORT"]
            password = connection_settings["PASSWORD"]

            # connect to this specific DB
            conn_str = f"host={host} port={port} user={user} password={password}"

            conn = psycopg2.connect(conn_str)
            conn.autocommit = True

            select_all_table_statement = """SELECT *
                                    FROM information_schema.tables
                                    WHERE table_schema = 'public'
                                    ORDER BY table_name;
                                """
            # just a visual representation of where we are
            print("-" * 20, db_name)
            try:
                not_reset_tables = list()
                # use the specific name for the DB
                with connections[name_to_use_for_connection].cursor() as cursor:
                    # using the current db as the cursor connection
                    cursor.execute(select_all_table_statement)
                    rows = dictfetchall(cursor)
                    # will loop over table names in the connected DB
                    for row in rows:
                        find_pk_statement = f"""
                            SELECT k.COLUMN_NAME
                            FROM information_schema.table_constraints t
                            LEFT JOIN information_schema.key_column_usage k
                            USING(constraint_name,table_schema,table_name)
                            WHERE t.constraint_type='PRIMARY KEY'
                                AND t.table_name='{row['table_name']}';
                        """
                        cursor.execute(find_pk_statement)
                        pk_column_names = dictfetchall(cursor)
                        for pk_dict in pk_column_names:
                            column_name = pk_dict["column_name"]

                        # time to build the reset sequence command for each table
                        # taken from django: https://docs.djangoproject.com/en/3.0/ref/django-admin/#sqlsequencereset
                        # example: SELECT setval(pg_get_serial_sequence('"[TABLE]"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "[TABLE]";
                        try:
                            # reset_statement = f"""SELECT setval(pg_get_serial_sequence('"{row['table_name']}"','{column_name}'),
                            # coalesce(max("{column_name}"), 1), max("{column_name}") IS NOT null) FROM "{row['table_name']}" """

                            # tuned reset statement to work with our DB since for some reason the dump doesnt have serial sequnces...
                            reset_statement = f"""SELECT setval('{row['table_name']}_{column_name}_seq', max({row['table_name']}.{column_name})) FROM {row['table_name']};"""
                            cursor.execute(reset_statement)
                            return_values = dictfetchall(cursor)
                            # will be 1 row
                            for value in return_values:
                                print(
                                    f"Sequence reset to {value['setval']} for {row['table_name']}"
                                )
                        except Exception as ex:
                            # will only fail if PK is not an integer...
                            # currently in my system this is from django.contrib.sessions
                            not_reset_tables.append(
                                f"{row['table_name']} not reset, {str(ex)}"
                            )

            except psycopg2.Error as ex:
                raise SystemExit(f"Error: {ex}")

            conn.close()
            print("-" * 5, " ALL ERRORS ", "-" * 5)
            for item_statement in not_reset_tables:
                # shows which tables produced errors, so far I have only
                # seen this with PK's that are not integers because of the MAX() method
                print(item_statement)

            # just a visual representation of where we are
            print("-" * 20, db_name)

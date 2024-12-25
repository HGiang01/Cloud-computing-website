import psycopg2
import os

SQL_host = "x"
__cnx = None

def get_sql_connection():
    global __cnx
    try:
        if not __cnx or __cnx.closed:
            __cnx = psycopg2.connect(
                host="x",
                database="x",
                user="x",
                password="x"
            )
        return __cnx
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
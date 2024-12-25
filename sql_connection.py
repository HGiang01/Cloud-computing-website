import psycopg2
import os

SQL_host = "104.199.139.124"
__cnx = None

def get_sql_connection():
    global __cnx
    try:
        if not __cnx or __cnx.closed:
            __cnx = psycopg2.connect(
                host="104.199.139.124",
                database="gcp-group11",
                user="postgres",
                password="dh22hm"
            )
        return __cnx
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
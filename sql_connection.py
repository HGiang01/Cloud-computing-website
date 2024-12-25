from google.cloud.sql.connector import Connector
import psycopg2
import os

SQL_host = "104.199.139.124"
__cnx = None

# Khởi tạo đối tượng Connector (chỉ dùng khi chạy trên Cloud SQL)
connector = Connector()

def get_sql_connection():
    try:
        # Kiểm tra môi trường
        running_on_cloud = os.getenv("RUNNING_ON_CLOUD", "false").lower() == "true"

        if running_on_cloud:
            # Kết nối qua Cloud SQL Connector trên Cloud Run
            instance_connection_name = os.getenv("INSTANCE_CONNECTION_NAME")  # e.g., "PROJECT_ID:REGION:INSTANCE_ID"
            db_user = "postgres"
            db_pass = "dh22hm"
            db_name = "gcp-group11"

            conn = connector.connect(
                instance_connection_name,
                "psycopg2",
                user=db_user,
                password=db_pass,
                db=db_name
            )
        else:
            # Kết nối trực tiếp khi chạy local
            conn = psycopg2.connect(
                host= SQL_host,  # hoặc IP của database trong mạng local
                database="gcp-group11",
                user="postgres",
                password="dh22hm"
            )
        return conn

    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
        return None



# def get_sql_connection():
#     global __cnx
#     try:
#         if not __cnx or __cnx.closed:
#             __cnx = psycopg2.connect(
#                 host="104.199.139.124",
#                 database="gcp-group11",
#                 user="postgres",
#                 password="dh22hm"
#             )
#         return __cnx
#     except Exception as e:
#         print(f"Error connecting to database: {str(e)}")

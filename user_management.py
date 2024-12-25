from sql_connection import get_sql_connection

def get_all_users(connection):
    cur = connection.cursor()
    cur.execute("SELECT * FROM users")
    rows = cur.fetchall()

    data = []
    for row in rows:
        data.append({
            'name': row[0], 
            'password': row[1],
            'email': row[2],
            'address': row[3]
        })    

    return data

def insert_user(connection, name, password, email, address):
    cur = connection.cursor()
    cur.execute("INSERT INTO users VALUES (%s, %s, %s, %s)", (name, password, email, address))
    connection.commit()

if __name__ == '__main__':
    connection = get_sql_connection()
    try:
        get_all_users(connection)
    finally:
        if not connection.closed:
            connection.close()
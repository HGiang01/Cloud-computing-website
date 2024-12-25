from sql_connection import get_sql_connection
from datetime import datetime

def insertOrder(connection, user, price, status):
    cur = connection.cursor()
    cur.execute("INSERT INTO orders VALUES (%s, %s, %s, %s)", (user, price, status, str(datetime.now())))
    connection.commit()

    print(f"Successful inserted order for {user}")

def get_orders(connection, user):
    cur = connection.cursor()
    cur.execute("SELECT * FROM orders WHERE user_name = %s ORDER BY date DESC", (user,))
    rows = cur.fetchall()

    data = []
    for row in rows:
        data.append({
            'name': row[0],
            'price': row[1],
            'status': row[2],
            'date': row[3]
        })

    return data

if __name__ == '__main__':
    connection = get_sql_connection()
    try:
        # print(insertOrder(connection, 'admin', 500000, 'Completed'))
        print(get_orders(connection, 'admin'))
    finally:
        if not connection.closed:
            connection.close()
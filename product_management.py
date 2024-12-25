from sql_connection import get_sql_connection

def get_all_products(connection):
    cur = connection.cursor()
    cur.execute("SELECT * FROM products")
    rows = cur.fetchall()
    
    data = []
    for row in rows:
        data.append({
            'product_id': row[0],
            'product_name': row[1],
            'price': row[2],
            'quantity': row[3],
            'image_url': row[4]
        })

    return data

def update_product_quantity(connection, product_id, quantity):
    cur = connection.cursor()
    cur.execute("UPDATE products SET quantity = %s WHERE product_id = %s", (quantity, product_id))
    connection.commit()

if __name__ == '__main__':
    connection = get_sql_connection()
    try:
        print(get_all_products(connection))
    finally:
        if not connection.closed:
            connection.close()
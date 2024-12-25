from flask import Flask, redirect, jsonify, request, render_template, session
from flask_cors import CORS
import psycopg2
import user_management
import product_management
import order_view
from sql_connection import get_sql_connection

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.secret_key = 'ng7uyw!fsdf'
connection = get_sql_connection()

# Page URL
@app.route('/')
def login_page():
    return render_template('login.html')

@app.route('/orders')
def order_page():
    return render_template('order.html')

@app.route('/grocery') 
def product_page():
    return render_template('grocery.html')

# USER
@app.route('/getUsers', methods=['GET'])
def get_users():
    respone = user_management.get_all_users(connection)
    respone = jsonify(respone)
    return respone

@app.route('/insertUser', methods=['POST'])
def insert_user():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        address = data.get('address')
        
        try: 
            user_management.insert_user(connection, username, password, email, address)
            # Trả về URL của trang grocery.html
            return jsonify({'redirectUrl': '/'})
        except psycopg2.Error as e:
            connection.rollback()
            return jsonify({'error': str(e)}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        address = data.get('address')

        # Lưu vào session để sử dụng ở trang khác nếu cần
        session['username'] = username
        session['password'] = password
        session['email'] = email
        session['address'] = address

        # Trả về URL của trang grocery.html
        return jsonify({'redirectUrl': '/grocery'})
    
    elif request.method == 'GET':
        # Kiểm tra xem session có tồn tại không
        if 'username' in session and 'password' in session:
            return jsonify({
                'username': session['username'],
                'password': session['password'],
                'email': session['email'],
                'address': session['address']
            })
        else:
            return jsonify({'message': 'Empty'}), 404
        
@app.route('/logout', methods=['GET'])
def logout():
    session.clear()  # Xóa toàn bộ session
    return jsonify({'redirectUrl': '/'})


# PRODUCTS
@app.route('/getProducts', methods=['GET'])
def get_products():
    respone = product_management.get_all_products(connection)
    respone = jsonify(respone)
    return respone

@app.route('/updateQuantity', methods=['POST'])  # Sử dụng POST
def update_quantity():
    try:
        data = request.get_json() # Lấy dữ liệu JSON từ request
        product_id = data.get('id')
        quantity = data.get('quantity')

        if product_id is None or quantity is None:
            return jsonify({'error': 'Missing product_id or quantity'}), 400
        try:
            product_management.update_product_quantity(connection, product_id, quantity)
            return jsonify({'message': 'Quantity updated successfully'}), 200
        except psycopg2.Error as e:
            connection.rollback()  # Rollback nếu có lỗi
            return jsonify({'error': str(e)}), 500 # Trả về lỗi server
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ORDER
@app.route('/getOrders', methods=['GET'])
def get_orders():
    try:
        user = request.args.get('user') # Lấy user từ query parameters
        if not user:
            return jsonify({'error': 'Lack of a user information'}), 400
        response = order_view.get_orders(connection, user)
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/insertOrder', methods=['POST'])  # Sử dụng POST
def insertOrder():
    try:
        data = request.get_json() # Lấy dữ liệu JSON từ request
        user = data.get('user')
        price = data.get('price')
        status = data.get('status')

        try:
            order_view.insertOrder(connection, user, price, status)
            return jsonify({'message': 'Order inserted successfully'}), 200
        except psycopg2.Error as e:
            connection.rollback()  # Rollback nếu có lỗi
            return jsonify({'error': str(e)}), 500 # Trả về lỗi server

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print('Starting Python Flask Server For Grocery Website')
    app.run(port=5000)
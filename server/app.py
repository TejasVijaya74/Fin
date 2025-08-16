# server/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_db_connection
import hashlib
import sqlite3

app = Flask(__name__)
CORS(app)

# --- AUTHENTICATION Endpoints ---

@app.route("/api/signup", methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']
    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", (email, password_hash))
        conn.commit()
        user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "This email is already registered."}), 409
    finally:
        conn.close()
    return jsonify({"message": "User created successfully!", "user_id": user_id}), 201

@app.route("/api/login", methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    conn = get_db_connection()
    user_cursor = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    if user_cursor is None:
        return jsonify({"error": "Invalid email or password."}), 401
    user = dict(user_cursor)
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    if user['password_hash'] == password_hash:
        return jsonify({"message": "Login successful!", "user_id": user['id']})
    else:
        return jsonify({"error": "Invalid email or password."}), 401

# --- DATA Endpoints ---

@app.route("/api/transactions", methods=['GET'])
def get_transactions():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"error": "User ID is required."}), 400
    
    conn = get_db_connection()
    transactions_cursor = conn.execute("SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC", (user_id,)).fetchall()
    conn.close()
    transactions = [dict(row) for row in transactions_cursor]
    return jsonify(transactions)

@app.route("/api/goals", methods=['GET'])
def get_goals():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    conn = get_db_connection()
    goals_cursor = conn.execute("SELECT * FROM goals WHERE user_id = ?", (user_id,)).fetchall()
    conn.close()
    goals = [dict(row) for row in goals_cursor]
    return jsonify(goals)

@app.route("/api/transactions", methods=['POST'])
def add_transaction():
    new_transaction = request.get_json()
    user_id = new_transaction.get('userId')
    if not user_id:
        return jsonify({"error": "User ID is required."}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO transactions (date, description, amount, category, user_id) VALUES (?, ?, ?, ?, ?)",(new_transaction['date'],new_transaction['description'],new_transaction['amount'],new_transaction['category'],user_id))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({"message": "Transaction added successfully!", "id": new_id}), 201

@app.route("/api/expense-chart-data")
def get_expense_chart_data():
    # This remains static for now, but could be made dynamic in the future
    chart_data = [{"name": "Jan","expenses": 4200},{"name": "Feb","expenses": 3100},{"name": "Mar","expenses": 2500},{"name": "Apr","expenses": 2980},{"name": "May","expenses": 1990},{"name": "Jun","expenses": 2690},]
    return jsonify(chart_data)

if __name__ == "__main__":
    app.run(debug=True)
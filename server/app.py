# server/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_db_connection
import hashlib
import sqlite3
from datetime import datetime, timedelta
from prediction_engine import predict_next_month_expenses
from investment_calculator import calculate_investment_growth # 1. Add this new import

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

@app.route("/api/transactions", methods=['GET', 'POST'])
def handle_transactions():
    if request.method == 'GET':
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({"error": "User ID is required."}), 400
        conn = get_db_connection()
        transactions_cursor = conn.execute("SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC", (user_id,)).fetchall()
        conn.close()
        transactions = [dict(row) for row in transactions_cursor]
        return jsonify(transactions)

    elif request.method == 'POST':
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

@app.route("/api/transactions/<int:transaction_id>", methods=['DELETE'])
def delete_transaction(transaction_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transactions WHERE id = ?", (transaction_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Transaction deleted successfully."})


@app.route("/api/goals", methods=['GET', 'POST'])
def handle_goals():
    if request.method == 'GET':
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({"error": "User ID is required."}), 400
        conn = get_db_connection()
        goals_cursor = conn.execute("SELECT * FROM goals WHERE user_id = ?", (user_id,)).fetchall()
        conn.close()
        goals = [dict(row) for row in goals_cursor]
        return jsonify(goals)

    elif request.method == 'POST':
        new_goal = request.get_json()
        user_id = new_goal.get('userId')
        if not user_id:
            return jsonify({"error": "User ID is required."}), 400
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO goals (name, current_amount, target_amount, user_id) VALUES (?, ?, ?, ?)",
            (new_goal['name'], new_goal['current_amount'], new_goal['target_amount'], user_id)
        )
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return jsonify({"message": "Goal added successfully!", "id": new_id}), 201

@app.route("/api/goals/<int:goal_id>", methods=['DELETE'])
def delete_goal(goal_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM goals WHERE id = ?", (goal_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Goal deleted successfully."})


@app.route("/api/expense-chart-data", methods=['GET'])
def get_expense_chart_data():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"error": "User ID is required."}), 400
    today = datetime.today()
    months = {}
    for i in range(6):
        month_date = today - timedelta(days=i * 30)
        month_key = month_date.strftime('%Y-%m')
        month_name = month_date.strftime('%b')
        months[month_key] = {"name": month_name, "expenses": 0}
    six_months_ago = today - timedelta(days=180)
    conn = get_db_connection()
    query = """
        SELECT strftime('%Y-%m', date) as month, SUM(ABS(amount)) as total_expenses
        FROM transactions
        WHERE user_id = ? AND amount < 0 AND date >= ?
        GROUP BY month
    """
    expenses_cursor = conn.execute(query, (user_id, six_months_ago.strftime('%Y-%m-%d'))).fetchall()
    conn.close()
    for row in expenses_cursor:
        if row['month'] in months:
            months[row['month']]['expenses'] = row['total_expenses']
    chart_data = sorted(list(months.values()), key=lambda x: list(months.keys())[list(months.values()).index(x)])
    return jsonify(chart_data)

@app.route("/api/predict-expenses", methods=['GET'])
def predict_expenses():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"error": "User ID is required."}), 400
    
    predictions = predict_next_month_expenses(user_id)
    
    return jsonify(predictions)

# 2. Add this new endpoint
@app.route("/api/predict-investment", methods=['POST'])
def predict_investment():
    """Endpoint to calculate investment growth projection."""
    data = request.get_json()
    
    initial = data.get('initialAmount', 0)
    monthly = data.get('monthlyContribution', 0)
    rate = data.get('annualRate', 0)
    years = data.get('years', 0)

    projection_data = calculate_investment_growth(initial, monthly, rate, years)
    
    return jsonify(projection_data)


if __name__ == "__main__":
    app.run(debug=True)
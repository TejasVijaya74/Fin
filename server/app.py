# server/app.py

from flask import Flask, jsonify
from flask_cors import CORS

# Initialize the Flask application
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing)
CORS(app)

# API endpoint for transactions
@app.route("/api/transactions")
def get_transactions():
    """Returns a list of transactions."""
    transactions_data = [
        { "id": 1, "description": "Starbucks Coffee", "amount": -5.75, "category": "Food" },
        { "id": 2, "description": "Monthly Salary", "amount": 2500.00, "category": "Income" },
        { "id": 3, "description": "Netflix Subscription", "amount": -15.99, "category": "Entertainment" },
        { "id": 4, "description": "Gas Station", "amount": -45.30, "category": "Transport" },
        { "id": 5, "description": "Amazon Purchase", "amount": -120.50, "category": "Shopping" },
    ]
    return jsonify(transactions_data)

# API endpoint for the expense chart data
@app.route("/api/expense-chart-data")
def get_expense_chart_data():
    """Returns data formatted for the monthly expense chart."""
    chart_data = [
      { "name": "Jan", "expenses": 4200 },
      { "name": "Feb", "expenses": 3100 },
      { "name": "Mar", "expenses": 2500 },
      { "name": "Apr", "expenses": 2980 },
      { "name": "May", "expenses": 1990 },
      { "name": "Jun", "expenses": 2690 },
    ]
    return jsonify(chart_data)

# *** NEW ENDPOINT ***
# API endpoint for the goals data
@app.route("/api/goals")
def get_goals():
    """Returns a list of financial goals."""
    goals_data = [
      { "id": 1, "name": "Vacation to Bali", "current": 1500, "target": 5000 },
      { "id": 2, "name": "New MacBook Pro", "current": 950, "target": 1500 },
      { "id": 3, "name": "Emergency Fund", "current": 4800, "target": 10000 },
    ]
    # I've changed the goal names and amounts slightly
    return jsonify(goals_data)


# This part makes the server runnable.
if __name__ == "__main__":
    app.run(debug=True)
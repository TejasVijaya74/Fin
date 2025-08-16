# server/init_db.py
# *** UPDATED FILE ***
# This script now creates a sample user and links all data to that user.

from database import get_db_connection, create_tables
# A simple hashing library for passwords. In a real app, use something stronger like bcrypt.
import hashlib 

def populate_database():
    """Initializes the database with a sample user and linked data."""
    create_tables()
    
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear all tables
    cursor.execute("DELETE FROM transactions")
    cursor.execute("DELETE FROM goals")
    cursor.execute("DELETE FROM users")
    
    # 1. Create a sample user
    # IMPORTANT: Never store plain text passwords. We store a "hash".
    email = "test@example.com"
    password = "password123"
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    cursor.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", (email, password_hash))
    # Get the ID of the user we just created
    user_id = cursor.lastrowid

    # 2. Insert initial transactions, now linked to the user
    initial_transactions = [
        ('2025-08-16', 'Starbucks Coffee', -5.75, 'Food', user_id),
        ('2025-08-16', 'Monthly Salary', 2500.00, 'Income', user_id),
        ('2025-08-15', 'Netflix Subscription', -15.99, 'Entertainment', user_id),
    ]
    cursor.executemany(
        "INSERT INTO transactions (date, description, amount, category, user_id) VALUES (?, ?, ?, ?, ?)",
        initial_transactions
    )

    # 3. Insert initial goals, now linked to the user
    initial_goals = [
        ('Vacation to Bali', 1500, 5000, user_id),
        ('New MacBook Pro', 950, 1500, user_id),
    ]
    cursor.executemany(
        "INSERT INTO goals (name, current_amount, target_amount, user_id) VALUES (?, ?, ?, ?)",
        initial_goals
    )

    conn.commit()
    conn.close()
    print(f"Database initialized for user '{email}' with sample data.")

if __name__ == '__main__':
    populate_database()
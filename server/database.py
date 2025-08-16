# server/database.py
# *** UPDATED FILE ***

import sqlite3

DATABASE_NAME = 'finwiz.db'

def get_db_connection():
    """Establishes a connection to the SQLite database."""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    # Enable foreign key support
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def create_tables():
    """Creates the necessary tables including the new users table."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Create the users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')

    # 2. Update the transactions table with a user_id foreign key
    # We will drop the old table and recreate it to add the new column and constraint.
    # In a real production environment, you would use a migration tool for this.
    cursor.execute("DROP TABLE IF EXISTS transactions")
    cursor.execute('''
        CREATE TABLE transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # 3. Update the goals table with a user_id foreign key
    cursor.execute("DROP TABLE IF EXISTS goals")
    cursor.execute('''
        CREATE TABLE goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            current_amount REAL NOT NULL,
            target_amount REAL NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    conn.commit()
    conn.close()
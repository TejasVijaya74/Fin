# server/prediction_engine.py
# *** UPDATED WITH SIMPLER, MORE ROBUST LOGIC ***

from database import get_db_connection
import pandas as pd

def predict_next_month_expenses(user_id):
    """
    Predicts next month's expenses by category based on historical averages.
    """
    conn = get_db_connection()
    query = "SELECT date, category, amount FROM transactions WHERE user_id = ? AND amount < 0"
    
    try:
        df = pd.read_sql_query(query, conn, params=(user_id,))
    finally:
        conn.close()

    if df.empty:
        return []

    # Convert 'date' column to datetime objects and make amounts positive
    df['date'] = pd.to_datetime(df['date'])
    df['amount'] = df['amount'].abs()
    
    # Create a 'month' column (e.g., 2025-08) to group by
    df['month'] = df['date'].dt.to_period('M')

    # Calculate the total spent for each category in each month
    monthly_totals = df.groupby(['category', 'month'])['amount'].sum().reset_index()

    # Now, calculate the average monthly spending across all months for each category
    category_predictions = monthly_totals.groupby('category')['amount'].mean().reset_index()
    
    # Rename the column for the frontend
    category_predictions.rename(columns={'amount': 'predicted_amount'}, inplace=True)
    
    # Convert the result to the list of dictionaries format
    predictions = category_predictions.to_dict('records')

    return predictions

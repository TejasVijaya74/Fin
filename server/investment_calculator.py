def calculate_investment_growth(initial_amount, monthly_contribution, annual_rate, years):
    """
    Calculates the year-by-year growth of an investment with compound interest.
    """
    projection = []
    current_value = float(initial_amount)
    monthly_rate = float(annual_rate) / 100 / 12

    # Add the starting point to our projection data
    projection.append({'year': 0, 'value': round(current_value, 2)})

    for year in range(1, int(years) + 1):
        # Calculate growth for 12 months
        for month in range(12):
            # Add the monthly contribution
            current_value += float(monthly_contribution)
            # Calculate interest for the month
            interest = current_value * monthly_rate
            # Add interest to the current value
            current_value += interest
        
        # Add the year-end value to our projection data
        projection.append({'year': year, 'value': round(current_value, 2)})

    return projection
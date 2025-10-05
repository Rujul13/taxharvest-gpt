import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict, Optional

def get_current_price(ticker: str) -> Optional[float]:
    """Fetch current stock price using yfinance"""
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1d")
        if hist.empty:
            return None
        return round(hist['Close'].iloc[-1], 2)
    except Exception as e:
        print(f"Error fetching price for {ticker}: {e}")
        return None

def calculate_holding_period(purchase_date_str: str) -> int:
    """Calculate number of days position has been held"""
    try:
        purchase_date = datetime.strptime(purchase_date_str, "%Y-%m-%d")
        today = datetime.now()
        delta = today - purchase_date
        return delta.days
    except Exception as e:
        print(f"Error calculating holding period: {e}")
        return 0

def get_wash_sale_end_date(sell_date: Optional[datetime] = None) -> str:
    """Calculate when wash sale period ends (31 days after sale)"""
    if sell_date is None:
        sell_date = datetime.now()
    end_date = sell_date + timedelta(days=31)
    return end_date.strftime("%Y-%m-%d")

def enrich_position_with_market_data(position: Dict) -> Dict:
    """Add current price and calculations to position"""
    ticker = position['ticker']
    current_price = get_current_price(ticker)
    
    if current_price is None:
        raise ValueError(f"Could not fetch price for {ticker}")
    
    shares = position['shares']
    cost_basis = position['cost_basis']
    current_value = round(current_price * shares, 2)
    unrealized_gl = round(current_value - cost_basis, 2)
    holding_days = calculate_holding_period(position['purchase_date'])
    is_long_term = holding_days > 365
    
    return {
        **position,
        'current_price': current_price,
        'current_value': current_value,
        'unrealized_gain_loss': unrealized_gl,
        'holding_period_days': holding_days,
        'is_long_term': is_long_term
    }
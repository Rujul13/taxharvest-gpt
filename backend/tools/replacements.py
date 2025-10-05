import json
from pathlib import Path
from typing import Dict, List

# Load ETF replacements database
DATA_PATH = Path(__file__).parent.parent / "data" / "etf_replacements.json"

with open(DATA_PATH, 'r') as f:
    ETF_DATABASE = json.load(f)

def find_replacements(ticker: str) -> List[Dict[str, str]]:
    """Find suitable replacement securities for a given ticker"""
    if ticker in ETF_DATABASE:
        return ETF_DATABASE[ticker]['replacements']
    
    # Default fallback
    return [
        {"ticker": "VTI", "name": "Vanguard Total Stock Market ETF"},
        {"ticker": "VOO", "name": "Vanguard S&P 500 ETF"}
    ]

def get_best_replacement(ticker: str) -> Dict[str, str]:
    """Get the top recommended replacement"""
    replacements = find_replacements(ticker)
    return replacements[0] if replacements else {"ticker": "VTI", "name": "Vanguard Total Stock Market ETF"}
from pydantic import BaseModel, Field
from typing import List, Optional

class Position(BaseModel):
    ticker: str = Field(..., description="Stock ticker symbol")
    shares: float = Field(..., gt=0, description="Number of shares")
    cost_basis: float = Field(..., gt=0, description="Total amount paid for position")
    purchase_date: str = Field(..., description="Purchase date in YYYY-MM-DD format")

class Portfolio(BaseModel):
    positions: List[Position]
    tax_bracket: float = Field(..., ge=0.1, le=0.37, description="Federal tax bracket")

class HarvestOpportunity(BaseModel):
    ticker: str
    shares: float
    unrealized_loss: float
    replacement_ticker: str
    replacement_name: str
    tax_savings: float
    is_long_term: bool
    action_steps: List[str]
    rebuy_date: Optional[str] = None

class AnalysisResult(BaseModel):
    total_tax_savings: float
    opportunities: List[HarvestOpportunity]
    summary: str
    annual_projection: float
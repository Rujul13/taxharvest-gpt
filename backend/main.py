from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.portfolio import Portfolio, AnalysisResult, HarvestOpportunity
from tools.stock_data import enrich_position_with_market_data, get_wash_sale_end_date
from tools.replacements import get_best_replacement
from agents.harvest_agents import run_harvest_analysis
from datetime import datetime

app = FastAPI(
    title="TaxHarvestGPT API",
    description="AI-powered tax-loss harvesting recommendations",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "TaxHarvestGPT API",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/analyze-portfolio", response_model=AnalysisResult)
async def analyze_portfolio(portfolio: Portfolio):
    """
    Analyze a portfolio for tax-loss harvesting opportunities
    """
    try:
        # Step 1: Enrich positions with current market data
        print(f"\n📊 Analyzing portfolio with {len(portfolio.positions)} positions...")
        enriched_positions = []
        
        for pos in portfolio.positions:
            try:
                enriched = enrich_position_with_market_data(pos.dict())
                enriched_positions.append(enriched)
                print(f"✓ {pos.ticker}: ${enriched['unrealized_gain_loss']:,.2f} {'gain' if enriched['unrealized_gain_loss'] > 0 else 'loss'}")
            except Exception as e:
                print(f"✗ Error with {pos.ticker}: {e}")
                raise HTTPException(status_code=400, detail=f"Could not fetch data for {pos.ticker}")
        
        # Step 2: Filter for loss positions only
        loss_positions = [p for p in enriched_positions if p['unrealized_gain_loss'] < -1000]
        
        if not loss_positions:
            return AnalysisResult(
                total_tax_savings=0.0,
                opportunities=[],
                summary="No tax-loss harvesting opportunities found. All positions are either gains or losses less than $1,000.",
                annual_projection=0.0
            )
        
        print(f"\n🎯 Found {len(loss_positions)} positions with losses > $1,000")
        
        # Step 3: Run AI analysis
        print(f"\n🤖 Running AI analysis with Claude Sonnet 4.5...")
        ai_result = run_harvest_analysis(loss_positions, portfolio.tax_bracket)
        
        print(f"\n✅ AI Analysis Complete!")
        print(f"Result: {ai_result}")
        
        # Step 4: Parse AI result and structure response
        opportunities = parse_ai_recommendations(ai_result, loss_positions, portfolio.tax_bracket)
        
        total_savings = sum(opp.tax_savings for opp in opportunities)
        annual_projection = total_savings * 3  # Assuming quarterly harvesting
        
        return AnalysisResult(
            total_tax_savings=round(total_savings, 2),
            opportunities=opportunities,
            summary=f"Found {len(opportunities)} tax-loss harvesting opportunities with total immediate savings of ${total_savings:,.2f}",
            annual_projection=round(annual_projection, 2)
        )
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def parse_ai_recommendations(ai_result: str, positions: list, tax_bracket: float) -> list:
    """Parse AI crew output into structured opportunities"""
    opportunities = []
    
    # For each loss position, create structured opportunity
    for pos in positions:
        ticker = pos['ticker']
        loss = abs(pos['unrealized_gain_loss'])
        
        # Get replacement
        replacement = get_best_replacement(ticker)
        
        # Calculate tax savings
        if pos['is_long_term']:
            tax_rate = 0.15  # Long-term capital gains rate
        else:
            tax_rate = tax_bracket  # Short-term = ordinary income rate
        
        tax_savings = round(loss * tax_rate, 2)
        
        # Generate action steps
        rebuy_date = get_wash_sale_end_date()
        action_steps = [
            f"Sell {pos['shares']:.0f} shares of {ticker} (currently at ${pos['current_price']:.2f}/share)",
            f"Immediately buy equivalent dollar amount of {replacement['ticker']} ({replacement['name']})",
            f"Set calendar reminder for {rebuy_date} - you can rebuy {ticker} after this date without triggering wash sale"
        ]
        
        opportunities.append(HarvestOpportunity(
            ticker=ticker,
            shares=pos['shares'],
            unrealized_loss=round(loss, 2),
            replacement_ticker=replacement['ticker'],
            replacement_name=replacement['name'],
            tax_savings=tax_savings,
            is_long_term=pos['is_long_term'],
            action_steps=action_steps,
            rebuy_date=rebuy_date
        ))
    
    # Sort by tax savings (highest first)
    opportunities.sort(key=lambda x: x.tax_savings, reverse=True)
    
    return opportunities

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
from crewai import Agent, Task, Crew, Process
from langchain_anthropic import ChatAnthropic
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Claude
claude = ChatAnthropic(
    model="claude-sonnet-4-5-20250929",
    anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
    temperature=0,
    max_tokens=4096
)

def create_harvest_crew(positions_data: list, tax_bracket: float):
    """Create a crew of agents to analyze tax-loss harvesting opportunities"""
    
    # Format positions data for agents
    positions_str = "\n".join([
        f"- {p['ticker']}: {p['shares']} shares, Cost: ${p['cost_basis']:,.2f}, "
        f"Current: ${p['current_value']:,.2f}, "
        f"Gain/Loss: ${p['unrealized_gain_loss']:,.2f}, "
        f"Held: {p['holding_period_days']} days ({'Long-term' if p['is_long_term'] else 'Short-term'})"
        for p in positions_data
    ])
    
    # Agent 1: Portfolio Analyzer
    analyzer = Agent(
        role='Senior Tax Loss Harvesting Analyst',
        goal='Identify positions with unrealized losses that are candidates for tax-loss harvesting',
        backstory="""You are a veteran tax analyst with 20+ years helping high-net-worth 
        individuals optimize their portfolios. You understand capital gains taxation, 
        holding periods, and IRS wash sale rules. You only recommend harvesting losses 
        greater than $1,000 to make it worthwhile.""",
        llm=claude,
        verbose=True,
        allow_delegation=False
    )
    
    # Agent 2: Replacement Finder
    replacement_finder = Agent(
        role='ETF Research Specialist',
        goal='Find suitable replacement securities that maintain exposure without violating wash sale rules',
        backstory="""You are an expert in ETF analysis and IRS regulations. You know that 
        'substantially identical' securities trigger wash sales, so you recommend ETFs 
        that track different indices or have different methodologies. You prioritize 
        low-cost, liquid ETFs from reputable providers.""",
        llm=claude,
        verbose=True,
        allow_delegation=False
    )
    
    # Agent 3: Tax Calculator
    tax_calculator = Agent(
        role='CPA specializing in Investment Taxation',
        goal='Calculate precise tax savings from harvesting strategies',
        backstory="""You are a licensed CPA who specializes in investment taxation. 
        You understand that short-term losses (held <1 year) save tax at ordinary income 
        rates, while long-term losses save at capital gains rates (typically 15% or 20%). 
        You always show your calculations clearly.""",
        llm=claude,
        verbose=True,
        allow_delegation=False
    )
    
    # Agent 4: Recommendation Synthesizer
    advisor = Agent(
        role='Fiduciary Financial Advisor',
        goal='Create clear, actionable recommendations prioritized by tax savings',
        backstory="""You are a CFP® professional who excels at translating complex 
        tax strategies into simple action steps. You prioritize opportunities by 
        highest tax savings first, and you always warn about wash sale periods. 
        You write as if explaining to a smart friend, not a tax expert.""",
        llm=claude,
        verbose=True,
        allow_delegation=False
    )
    
    # Define Tasks
    analyze_task = Task(
        description=f"""Analyze this portfolio and identify ALL positions with unrealized 
        LOSSES greater than $1,000:
        
        {positions_str}
        
        For each loss position, extract:
        1. Ticker and loss amount
        2. Whether it's short-term (<365 days) or long-term (>365 days)
        3. Current value
        
        List them from largest loss to smallest loss.""",
        agent=analyzer,
        expected_output="List of positions with losses, sorted by loss amount"
    )
    
    find_replacements_task = Task(
        description="""For EACH harvest candidate identified, find the SINGLE BEST 
        replacement security. Choose from these available replacements:
        
        - For AAPL: SCHG (Schwab US Large-Cap Growth ETF)
        - For MSFT: VGT (Vanguard Information Technology ETF)
        - For TSLA: ARKK (ARK Innovation ETF)
        - For NVDA: SMH (VanEck Semiconductor ETF)
        - For AMZN: XLY (Consumer Discretionary Select Sector SPDR)
        - For GOOGL: XLC (Communication Services Select Sector SPDR)
        - For META: XLC (Communication Services Select Sector SPDR)
        - For any other stock: VTI (Vanguard Total Stock Market ETF)
        
        Explain briefly why each replacement maintains similar exposure without being 
        substantially identical.""",
        agent=replacement_finder,
        expected_output="Replacement ticker and justification for each opportunity"
    )
    
    calculate_tax_task = Task(
        description=f"""Calculate tax savings for each opportunity using this tax bracket: {tax_bracket:.0%}
        
        RULES:
        - Short-term losses (held <365 days): Save tax at ordinary income rate = loss × {tax_bracket}
        - Long-term losses (held >365 days): Save tax at capital gains rate = loss × 0.15
          (Use 15% for simplicity; assume investor is in 15% capital gains bracket)
        
        For each opportunity, show:
        1. Loss amount
        2. Holding period type (short-term or long-term)
        3. Tax rate applied
        4. Tax savings calculation
        5. Total tax savings
        
        Also estimate ANNUAL savings if investor harvests quarterly (multiply by 3).""",
        agent=tax_calculator,
        expected_output="Tax savings calculation for each opportunity with annual projection"
    )
    
    synthesize_task = Task(
        description="""Create final recommendations in this EXACT format for each opportunity:
        
        For each harvest opportunity, provide:
        1. **Ticker**: [Stock symbol]
        2. **Action**: Sell [number] shares
        3. **Loss**: -$[amount]
        4. **Replacement**: Buy [ticker] ([full name])
        5. **Tax Savings**: $[amount] ([percentage]% tax rate)
        6. **Steps**:
           - Step 1: Sell [shares] shares of [ticker]
           - Step 2: Immediately buy [shares] shares of [replacement ticker]
           - Step 3: Set reminder to review on [date 31 days from now]
        
        At the end, provide:
        - **Total Immediate Tax Savings**: $[sum of all]
        - **Projected Annual Savings**: $[total × 3] (if done quarterly)
        
        Sort opportunities by tax savings (highest first).
        
        Write in clear, friendly language.""",
        agent=advisor,
        expected_output="Complete prioritized action plan with specific steps"
    )
    
    # Create Crew
    crew = Crew(
        agents=[analyzer, replacement_finder, tax_calculator, advisor],
        tasks=[analyze_task, find_replacements_task, calculate_tax_task, synthesize_task],
        process=Process.sequential,
        verbose=True
    )
    
    return crew

def run_harvest_analysis(positions_data: list, tax_bracket: float) -> str:
    """Run the harvest analysis crew and return recommendations"""
    crew = create_harvest_crew(positions_data, tax_bracket)
    result = crew.kickoff()
    return result
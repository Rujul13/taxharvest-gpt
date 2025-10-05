# 🌾 TaxHarvestGPT

**AI-Powered Tax Loss Harvesting for Everyone**

Stop leaving $10,000+ on the table every year. TaxHarvestGPT uses Claude Sonnet 4.5 to analyze your portfolio and identify tax-loss harvesting opportunities in seconds.

[![Built with Claude Sonnet 4.5](https://img.shields.io/badge/Built%20with-Claude%20Sonnet%204.5-blue)](https://www.anthropic.com/claude)
[![IU Hackathon 2025](https://img.shields.io/badge/IU%20Hackathon-2025-red)](https://indiana.edu)

---

## 🎯 The Problem

- **87% of retail investors** never harvest tax losses
- Average missed savings: **$5,000-15,000 per year**
- Tax-loss harvesting is only available through:
  - Expensive financial advisors (1% AUM fees = $1,000/year on $100K)
  - Premium robo-advisors ($100K+ minimums)
- Manual tracking is confusing (wash sale rules, replacement securities, tax calculations)

## 💡 The Solution

TaxHarvestGPT democratizes sophisticated wealth management by:
- ✅ Analyzing portfolios in **30 seconds** (vs hours with an advisor)
- ✅ Providing **specific trade recommendations** (not generic advice)
- ✅ Calculating **exact tax savings** (immediate + annual projections)
- ✅ Protecting against **IRS wash sale violations**
- ✅ Explaining everything in **plain English** (no finance jargon)

## 🚀 Demo

**Try it yourself:** [Live Demo](#) *(coming soon)*

### Example Results:
- **Portfolio:** 4 tech stocks with losses
- **Immediate Tax Savings:** $3,360
- **Annual Projection:** $10,080 (if done quarterly)
- **10-Year Value:** $78,000+ (with compounding)

---

## 🏗️ Technical Architecture

### **Tech Stack**

**Backend:**
- Python 3.11 + FastAPI
- Claude Sonnet 4.5 (via Anthropic API)
- CrewAI (multi-agent orchestration)
- yfinance (real-time stock prices)

**Frontend:**
- React 18 + Vite
- Axios (API communication)
- Inline CSS (no external dependencies)

**AI Multi-Agent System:**
1. **Portfolio Analyzer** - Identifies loss positions and holding periods
2. **Replacement Finder** - Suggests similar ETFs (not substantially identical)
3. **Tax Calculator** - Computes savings based on tax brackets
4. **Recommendation Synthesizer** - Creates actionable step-by-step plans

### **Why Claude Sonnet 4.5?**
- **77.2% SWE-bench performance** - Best coding model for financial logic
- **200K token context** - Handles complex portfolio analysis
- **Extended thinking mode** - Deep reasoning for tax optimization
- **Agentic capabilities** - Perfect for multi-step workflows

---

## 🛠️ Installation & Setup

### **Prerequisites**
- Python 3.10+
- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/))

### **Backend Setup**
```bash
# Clone repository
git clone https://github.com/Rujul13/taxharvest-gpt.git
cd taxharvest-gpt/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# Run backend
python main.py
# Server runs at http://localhost:8000



📊 Features
Core Features

✅ Real-time stock price fetching (via yfinance)
✅ Multi-agent AI analysis (4 specialized agents)
✅ Wash sale rule validation (31-day periods)
✅ Replacement security recommendations
✅ Tax savings calculator (short-term vs long-term)
✅ Annual & 10-year projections

User Experience

✅ 5 pre-loaded demo portfolios
✅ Educational tooltips (hover for explanations)
✅ Step-by-step action plans
✅ Key terms glossary
✅ Mobile-responsive design

Demo Portfolios

🚀 Tech Heavy with Losses - High earner, bought at peaks
⚖️ Mixed Gains & Losses - Typical investor portfolio
📈 Aggressive Growth - Big losses, high risk tolerance
🆕 Recent Investor - All short-term positions
🛡️ Long-term Holder - Conservative buy-and-hold


🎓 How It Works
Step 1: Input Portfolio
Enter your stock positions (ticker, shares, cost basis, purchase date) or load a demo portfolio.
Step 2: AI Analysis
Claude Sonnet 4.5 multi-agent system:

Fetches current prices
Identifies positions with losses >$1,000
Finds suitable replacement securities
Calculates tax savings (based on your bracket)
Generates prioritized recommendations

Step 3: Take Action
Follow the step-by-step plan:

Sell losing position
Immediately buy replacement security
Set calendar reminder (rebuy after 31 days if desired)

┌─────────────────┐
│  User Browser   │
│  (React App)    │
└────────┬────────┘
         │
         │ POST /api/analyze-portfolio
         │ {positions, tax_bracket}
         ▼
┌─────────────────────────────────┐
│  FastAPI Backend                │
│  1. Validate input (Pydantic)   │
│  2. Enrich with market data     │
│     └─> yfinance API            │
│  3. Filter loss positions       │
└────────┬────────────────────────┘
         │
         │ positions_data[]
         ▼
┌─────────────────────────────────┐
│  CrewAI Multi-Agent System      │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Agent 1: Analyze         │  │
│  │ (Identify candidates)    │  │
│  └───────────┬──────────────┘  │
│              │                  │
│  ┌───────────▼──────────────┐  │
│  │ Agent 2: Find Replace    │  │
│  │ (ETF alternatives)       │  │
│  └───────────┬──────────────┘  │
│              │                  │
│  ┌───────────▼──────────────┐  │
│  │ Agent 3: Calculate Tax   │  │
│  │ (Savings computation)    │  │
│  └───────────┬──────────────┘  │
│              │                  │
│  ┌───────────▼──────────────┐  │
│  │ Agent 4: Synthesize      │  │
│  │ (Action plan)            │  │
│  └───────────┬──────────────┘  │
│              │                  │
│      Claude Sonnet 4.5 API     │
│      (200K context window)     │
└──────────────┬──────────────────┘
               │
               │ recommendations[]
               ▼
┌─────────────────────────────────┐
│  Response Processing            │
│  1. Parse AI output             │
│  2. Structure opportunities     │
│  3. Calculate projections       │
└────────┬────────────────────────┘
         │
         │ JSON response
         ▼
┌─────────────────┐
│  User Browser   │
│  (Results UI)   │
└─────────────────┘

💰 Market Opportunity
Target Market

61M taxable brokerage accounts in the US
$10K-100K portfolios (underserved segment)
Users currently have NO accessible solution

Revenue Model

Freemium: 1 free analysis/month
Premium: $9.99/month or $49/year (unlimited analyses)
Revenue potential: $5M ARR at 100K users

Competitive Advantage
FeatureTaxHarvestGPTWealthfrontFinancial AdvisorMinimum$0$100,000$250,000Cost$50/year$500-1,000/year$1,000-2,500/yearSpeed30 secondsDaysHoursEducationBuilt-in tooltipsLimitedVaries


Built for: Indiana University Claude Builder Club Hackathon 2025


📈 Future Roadmap
Phase 1 (Next 2 weeks)

 Broker integrations (Plaid API for automatic portfolio sync)
 User authentication & saved portfolios
 Email alerts for quarterly harvesting reminders

Phase 2 (Month 1-2)

 Mobile app (React Native)
 Tax form generation (Schedule D assistance)
 Multi-account support (track across brokers)
 Crypto tax-loss harvesting

Phase 3 (Month 3+)

 Advisor dashboard (white-label for financial advisors)
 API for fintech partners
 International tax rules (Canada, UK, EU)


🤝 Contributing
This project was built for the IU Claude Builder Club Hackathon. Contributions are welcome!
Areas for Improvement

Add more ETF replacement options
Support for options, mutual funds, bonds
Better mobile UI
More comprehensive tax scenarios
Multi-language support


📄 License
MIT License - feel free to use for learning or commercial purposes.

👨‍💻 Author
Rujul Jadav Prakash

Indiana University - MS in Computer Science
Email: rujprak@iu.edu
LinkedIn: linkedin.com/in/rujul-jadav
GitHub: github.com/Rujul13


🙏 Acknowledgments

Anthropic - For Claude Sonnet 4.5 and the amazing API
IU Claude Builder Club - For organizing the hackathon
CrewAI - For the multi-agent framework
Yahoo Finance (yfinance) - For real-time stock data


📞 Support
Have questions or found a bug?

Open an issue on GitHub
Email: rujprak@iu.edu


Built with ❤️ and Claude Sonnet 4.5
"Stop leaving money on the table. Start harvesting smarter."
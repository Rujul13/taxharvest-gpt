import { useState } from 'react'
import Tooltip from './Tooltip'

const PortfolioInput = ({ onAnalyze, loading }) => {
  const [positions, setPositions] = useState([
    { ticker: 'AAPL', shares: 100, cost_basis: 18000, purchase_date: '2024-01-15' }
  ])
  const [taxBracket, setTaxBracket] = useState(0.32)
  const [selectedDemo, setSelectedDemo] = useState('')

  const demoPortfolios = {
    techLosses: {
      name: "Tech Heavy with Losses",
      positions: [
        { ticker: 'AAPL', shares: 100, cost_basis: 20000, purchase_date: '2024-01-15' },
        { ticker: 'TSLA', shares: 50, cost_basis: 20000, purchase_date: '2024-08-20' },
        { ticker: 'NVDA', shares: 30, cost_basis: 18000, purchase_date: '2024-03-10' },
        { ticker: 'META', shares: 40, cost_basis: 25000, purchase_date: '2024-02-01' }
      ],
      taxBracket: 0.32,
      description: "High earner with tech stocks bought at peaks"
    },
    mixedPortfolio: {
      name: "Mixed Gains & Losses",
      positions: [
        { ticker: 'AAPL', shares: 100, cost_basis: 18000, purchase_date: '2024-01-15' },
        { ticker: 'MSFT', shares: 75, cost_basis: 21000, purchase_date: '2023-06-10' },
        { ticker: 'TSLA', shares: 50, cost_basis: 15000, purchase_date: '2024-08-20' },
        { ticker: 'AMZN', shares: 60, cost_basis: 12000, purchase_date: '2024-05-15' }
      ],
      taxBracket: 0.32,
      description: "Typical investor with some winners and losers"
    },
    aggressiveGrowth: {
      name: "Aggressive Growth (Big Losses)",
      positions: [
        { ticker: 'TSLA', shares: 100, cost_basis: 30000, purchase_date: '2024-02-01' },
        { ticker: 'NVDA', shares: 50, cost_basis: 25000, purchase_date: '2024-01-10' },
        { ticker: 'META', shares: 80, cost_basis: 45000, purchase_date: '2024-03-15' },
        { ticker: 'GOOGL', shares: 100, cost_basis: 18000, purchase_date: '2024-07-01' }
      ],
      taxBracket: 0.35,
      description: "High risk tolerance, bought at market highs"
    },
    recentInvestor: {
      name: "Recent Investor (Short-term Losses)",
      positions: [
        { ticker: 'AAPL', shares: 50, cost_basis: 12000, purchase_date: '2024-09-01' },
        { ticker: 'MSFT', shares: 40, cost_basis: 18000, purchase_date: '2024-10-01' },
        { ticker: 'TSLA', shares: 30, cost_basis: 12000, purchase_date: '2024-08-15' }
      ],
      taxBracket: 0.24,
      description: "New to investing, all short-term positions"
    },
    conservativeInvestor: {
      name: "Long-term Holder with Some Losses",
      positions: [
        { ticker: 'AAPL', shares: 200, cost_basis: 25000, purchase_date: '2022-01-15' },
        { ticker: 'MSFT', shares: 100, cost_basis: 28000, purchase_date: '2021-06-10' },
        { ticker: 'GOOGL', shares: 150, cost_basis: 20000, purchase_date: '2023-03-20' }
      ],
      taxBracket: 0.22,
      description: "Buy and hold investor, mostly long-term positions"
    }
  }

  const addPosition = () => {
    setPositions([...positions, { ticker: '', shares: '', cost_basis: '', purchase_date: '' }])
  }

  const removePosition = (index) => {
    setPositions(positions.filter((_, i) => i !== index))
  }

  const updatePosition = (index, field, value) => {
    const newPositions = [...positions]
    newPositions[index][field] = value
    setPositions(newPositions)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const formattedPositions = positions.map(p => ({
      ticker: p.ticker.toUpperCase(),
      shares: parseFloat(p.shares),
      cost_basis: parseFloat(p.cost_basis),
      purchase_date: p.purchase_date
    }))

    onAnalyze({
      positions: formattedPositions,
      tax_bracket: parseFloat(taxBracket)
    })
  }

  const loadDemoPortfolio = (demoKey) => {
    if (!demoKey) return
    const demo = demoPortfolios[demoKey]
    setPositions(demo.positions)
    setTaxBracket(demo.taxBracket)
    setSelectedDemo(demoKey)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Educational Banner */}
        <div style={styles.infoBanner}>
          <div style={styles.infoIcon}>💡</div>
          <div style={styles.infoContent}>
            <strong>What is Tax-Loss Harvesting?</strong>
            <p style={styles.infoText}>
              <Tooltip text="Tax-loss harvesting lets you sell losing investments to offset capital gains taxes. You can save thousands annually by strategically realizing losses.">
                Tax-loss harvesting
              </Tooltip>{' '}
              is a strategy where you sell investments at a loss to reduce your tax bill, then immediately 
              buy a similar (but not identical) investment to maintain your market exposure. The IRS{' '}
              <Tooltip text="The wash sale rule prevents you from claiming a loss if you buy the same or substantially identical security within 30 days before or after the sale.">
                wash sale rule
              </Tooltip>{' '}
              says you must wait 31 days before buying back the same security.
            </p>
          </div>
        </div>

        <div style={styles.header}>
          <h2 style={styles.title}>📊 Enter Your Portfolio</h2>
          <div style={styles.demoSection}>
            <select 
              value={selectedDemo}
              onChange={(e) => loadDemoPortfolio(e.target.value)}
              style={styles.demoSelect}
            >
              <option value="">-- Load Demo Portfolio --</option>
              <option value="techLosses">🚀 Tech Heavy with Losses</option>
              <option value="mixedPortfolio">⚖️ Mixed Gains & Losses</option>
              <option value="aggressiveGrowth">📈 Aggressive Growth (Big Losses)</option>
              <option value="recentInvestor">🆕 Recent Investor (Short-term)</option>
              <option value="conservativeInvestor">🛡️ Long-term Holder</option>
            </select>
            {selectedDemo && (
              <div style={styles.demoDescription}>
                {demoPortfolios[selectedDemo].description}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.taxBracketSection}>
            <label style={styles.label}>Your Federal Tax Bracket</label>
            <select 
              value={taxBracket} 
              onChange={(e) => setTaxBracket(e.target.value)}
              style={styles.select}
            >
              <option value="0.22">22% ($47,151 - $100,525)</option>
              <option value="0.24">24% ($100,526 - $191,950)</option>
              <option value="0.32">32% ($191,951 - $243,725)</option>
              <option value="0.35">35% ($243,726 - $609,350)</option>
              <option value="0.37">37% ($609,351+)</option>
            </select>
          </div>

          <div style={styles.positionsSection}>
            <label style={styles.label}>Your Positions</label>
            
            {positions.map((position, index) => (
              <div key={index} style={styles.positionRow}>
                <input
                  type="text"
                  placeholder="Ticker"
                  value={position.ticker}
                  onChange={(e) => updatePosition(index, 'ticker', e.target.value)}
                  style={styles.input}
                  required
                />
                <input
                  type="number"
                  placeholder="Shares"
                  value={position.shares}
                  onChange={(e) => updatePosition(index, 'shares', e.target.value)}
                  style={styles.input}
                  required
                />
                <input
                  type="number"
                  placeholder="Cost Basis ($)"
                  value={position.cost_basis}
                  onChange={(e) => updatePosition(index, 'cost_basis', e.target.value)}
                  style={styles.input}
                  required
                />
                <input
                  type="date"
                  value={position.purchase_date}
                  onChange={(e) => updatePosition(index, 'purchase_date', e.target.value)}
                  style={styles.input}
                  required
                />
                {positions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePosition(index)}
                    style={styles.removeButton}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={addPosition} style={styles.addButton}>
              + Add Position
            </button>
          </div>

          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? '🤖 Analyzing with AI...' : '🚀 Analyze Portfolio'}
          </button>
        </form>

        {loading && (
          <div style={styles.loadingMessage}>
            <p>⏳ Claude Sonnet 4.5 is analyzing your portfolio...</p>
            <p style={styles.subText}>This may take 30-60 seconds</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  infoBanner: {
    backgroundColor: '#eff6ff',
    border: '2px solid #bfdbfe',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    fontSize: '14px',
    color: '#374151',
    margin: '8px 0 0 0',
    lineHeight: '1.6',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e40af',
    margin: 0,
  },
  demoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: '250px',
  },
  demoSelect: {
    padding: '10px 16px',
    backgroundColor: '#e0e7ff',
    color: '#1e40af',
    border: '2px solid #c7d2fe',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  demoDescription: {
    fontSize: '12px',
    color: '#6b7280',
    fontStyle: 'italic',
    padding: '4px 8px',
    backgroundColor: '#f9fafb',
    borderRadius: '4px',
  },
  taxBracketSection: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },
  positionsSection: {
    marginBottom: '24px',
  },
  positionRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1.5fr 1.5fr auto',
    gap: '8px',
    marginBottom: '12px',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },
  removeButton: {
    padding: '10px 16px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  addButton: {
    padding: '10px 16px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    width: '100%',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  loadingMessage: {
    marginTop: '24px',
    textAlign: 'center',
    color: '#6b7280',
  },
  subText: {
    fontSize: '14px',
    color: '#9ca3af',
  },
}

export default PortfolioInput
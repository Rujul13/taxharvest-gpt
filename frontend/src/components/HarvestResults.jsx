import Tooltip from './Tooltip'

const HarvestResults = ({ data, onReset }) => {
  if (!data || data.opportunities.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>✅ No Opportunities Found</h2>
          <p style={styles.noOpportunities}>
            {data?.summary || "All your positions are gains or losses less than $1,000. Nice job!"}
          </p>
          <button onClick={onReset} style={styles.resetButton}>
            Analyze Another Portfolio
          </button>
        </div>
      </div>
    )
  }

  const tenYearProjection = Math.round(data.annual_projection * 12 * 1.07)

  return (
    <div style={styles.container}>
      {/* Summary Card */}
      <div style={styles.summaryCard}>
        <h1 style={styles.mainTitle}>🎯 Tax Harvest Opportunities Found!</h1>
        
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <div style={styles.statValue}>${data.total_tax_savings.toLocaleString()}</div>
            <div style={styles.statLabel}>Immediate Tax Savings</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statValue}>${data.annual_projection.toLocaleString()}</div>
            <div style={styles.statLabel}>Projected Annual Savings</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statValue}>${tenYearProjection.toLocaleString()}</div>
            <div style={styles.statLabel}>10-Year Value (Compounded)</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statValue}>{data.opportunities.length}</div>
            <div style={styles.statLabel}>Opportunities</div>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div style={styles.opportunitiesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>📋 Action Plan</h2>
          <div style={styles.helpText}>
            <Tooltip text="Each opportunity shows you exactly what to sell, what to buy as a replacement, and when you can rebuy the original security without triggering the wash sale rule.">
              ❓ How to use this
            </Tooltip>
          </div>
        </div>
        
        {data.opportunities.map((opp, index) => (
          <div key={index} style={styles.opportunityCard}>
            <div style={styles.opportunityHeader}>
              <div>
                <h3 style={styles.opportunityTitle}>
                  #{index + 1} - {opp.ticker}
                </h3>
                <div style={styles.badge}>
                  {opp.is_long_term ? '📅 Long-term' : '⚡ Short-term'}
                </div>
              </div>
              <div style={styles.savingsBox}>
                <div style={styles.savingsAmount}>
                  ${opp.tax_savings.toLocaleString()}
                </div>
                <div style={styles.savingsLabel}>Tax Savings</div>
              </div>
            </div>

            <div style={styles.opportunityDetails}>
              <div style={styles.detailRow}>
                <strong>Current Loss:</strong> -${opp.unrealized_loss.toLocaleString()}
              </div>
              <div style={styles.detailRow}>
                <strong>Shares:</strong> {opp.shares}
              </div>
              <div style={styles.detailRow}>
                <strong>
                  <Tooltip text="A similar investment that maintains your market exposure without being substantially identical to your original holding.">
                    Replacement:
                  </Tooltip>
                </strong> {opp.replacement_ticker} - {opp.replacement_name}
              </div>
              <div style={styles.detailRow}>
                <strong>
                  <Tooltip text="After this date, you can buy back your original security without violating the IRS wash sale rule (31-day waiting period).">
                    Can Rebuy Original:
                  </Tooltip>
                </strong> {opp.rebuy_date}
              </div>
            </div>

            <div style={styles.stepsSection}>
              <strong style={styles.stepsTitle}>Action Steps:</strong>
              <ol style={styles.stepsList}>
                {opp.action_steps.map((step, i) => (
                  <li key={i} style={styles.step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {/* Glossary Section */}
      <div style={styles.glossaryCard}>
        <h3 style={styles.glossaryTitle}>📚 Key Terms</h3>
        <div style={styles.glossaryGrid}>
          <div style={styles.glossaryItem}>
            <strong>Tax-Loss Harvesting:</strong> Selling investments at a loss to offset capital gains and reduce your tax bill.
          </div>
          <div style={styles.glossaryItem}>
            <strong>Wash Sale Rule:</strong> IRS rule preventing you from claiming a tax loss if you buy the same security within 30 days before or after selling.
          </div>
          <div style={styles.glossaryItem}>
            <strong>Replacement Security:</strong> A similar (but not identical) investment that maintains your market exposure without triggering wash sale.
          </div>
          <div style={styles.glossaryItem}>
            <strong>Short-term Loss:</strong> Loss on an investment held less than 1 year. Saves tax at your ordinary income rate (higher).
          </div>
          <div style={styles.glossaryItem}>
            <strong>Long-term Loss:</strong> Loss on an investment held more than 1 year. Saves tax at capital gains rate (typically 15%).
          </div>
          <div style={styles.glossaryItem}>
            <strong>Cost Basis:</strong> The original amount you paid for an investment, including fees and commissions.
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div style={styles.resetSection}>
        <button onClick={onReset} style={styles.resetButton}>
          ← Analyze Another Portfolio
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
  },
  mainTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: '24px',
    textAlign: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statBox: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: '#f0f9ff',
    borderRadius: '8px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e40af',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: '16px',
  },
  noOpportunities: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  opportunitiesSection: {
    marginBottom: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e40af',
    margin: 0,
  },
  helpText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  opportunityCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e0e7ff',
  },
  opportunityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  opportunityTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 8px 0',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  savingsBox: {
    textAlign: 'right',
  },
  savingsAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#059669',
  },
  savingsLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  opportunityDetails: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  detailRow: {
    marginBottom: '8px',
    fontSize: '14px',
    color: '#374151',
  },
  stepsSection: {
    marginTop: '16px',
  },
  stepsTitle: {
    fontSize: '14px',
    color: '#1f2937',
    display: 'block',
    marginBottom: '8px',
  },
  stepsList: {
    margin: '0',
    paddingLeft: '20px',
  },
  step: {
    marginBottom: '8px',
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.6',
  },
  glossaryCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  glossaryTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: '16px',
  },
  glossaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  glossaryItem: {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#374151',
  },
  resetSection: {
    textAlign: 'center',
  },
  resetButton: {
    padding: '12px 24px',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
}

export default HarvestResults
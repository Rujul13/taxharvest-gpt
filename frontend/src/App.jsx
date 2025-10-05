import { useState } from 'react'
import axios from 'axios'
import PortfolioInput from './components/PortfolioInput'
import HarvestResults from './components/HarvestResults'

function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async (portfolioData) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Sending portfolio data:', portfolioData)
      
      const response = await axios.post('http://localhost:8000/api/analyze-portfolio', portfolioData)
      
      console.log('Received results:', response.data)
      setResults(response.data)
    } catch (err) {
      console.error('Analysis failed:', err)
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
  }

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>🌾 TaxHarvestGPT</h1>
          <p style={styles.tagline}>AI-Powered Tax Loss Harvesting</p>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {error && (
          <div style={styles.errorBox}>
            <strong>❌ Error:</strong> {error}
            <button onClick={handleReset} style={styles.errorButton}>Try Again</button>
          </div>
        )}

        {!results ? (
          <PortfolioInput onAnalyze={handleAnalyze} loading={loading} />
        ) : (
          <HarvestResults data={results} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Built with Claude Sonnet 4.5 | IU Claude Builder Club Hackathon 2025
        </p>
      </footer>
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '32px 16px',
    textAlign: 'center',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 8px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  tagline: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.9)',
    margin: 0,
  },
  main: {
    flex: 1,
    padding: '24px 16px',
  },
  errorBox: {
    maxWidth: '900px',
    margin: '0 auto 24px',
    padding: '16px 24px',
    backgroundColor: '#fee2e2',
    border: '2px solid #dc2626',
    borderRadius: '8px',
    color: '#991b1b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorButton: {
    padding: '8px 16px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  footer: {
    padding: '24px 16px',
    textAlign: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    margin: 0,
  },
}

export default App
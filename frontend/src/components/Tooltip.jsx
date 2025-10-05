import { useState } from 'react'

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false)

  return (
    <span style={styles.container}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={styles.trigger}
      >
        {children}
      </span>
      {show && (
        <div style={styles.tooltip}>
          {text}
        </div>
      )}
    </span>
  )
}

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  trigger: {
    cursor: 'help',
    borderBottom: '1px dotted #6b7280',
    color: '#1e40af',
    fontWeight: '600',
  },
  tooltip: {
    position: 'absolute',
    bottom: '125%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.5',
    width: '280px',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    pointerEvents: 'none',
  },
}

export default Tooltip
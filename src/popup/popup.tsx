import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { InterceptRule } from '@/types'
import '../styles/popup.css'

function PopupApp() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [rules, setRules] = useState<InterceptRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getRules' })
      setRules(response.rules)
      setIsEnabled(response.enabled)
    } catch (error) {
      console.error('Error loading rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'toggleExtension' })
      setIsEnabled(response.enabled)
    } catch (error) {
      console.error('Error toggling extension:', error)
    }
  }

  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  if (loading) {
    return (
      <div className="popup-container">
        <div className="spinner"></div>
      </div>
    )
  }

  const enabledRules = rules.filter(r => r.enabled)
  const totalRules = rules.length

  return (
    <div className="popup-container">
      <div className="header">
        <h1>Interceptly</h1>
        <button
          className={`toggle-btn ${isEnabled ? 'enabled' : 'disabled'}`}
          onClick={handleToggle}
          title={isEnabled ? 'Disable extension' : 'Enable extension'}
        >
          {isEnabled ? '✓' : '✕'}
        </button>
      </div>

      <div className="status">
        <div className="status-item">
          <span className="label">Active Rules:</span>
          <span className="value">{enabledRules.length}</span>
        </div>
        <div className="status-item">
          <span className="label">Total Rules:</span>
          <span className="value">{totalRules}</span>
        </div>
      </div>

      {totalRules > 0 ? (
        <div className="rules-preview">
          <h3>Recent Rules</h3>
          <ul>
            {rules.slice(0, 3).map(rule => (
              <li key={rule.id} className={rule.enabled ? 'enabled' : 'disabled'}>
                <span className="rule-type">{rule.type}</span>
                <span className="rule-pattern">{rule.urlPattern}</span>
              </li>
            ))}
          </ul>
          {totalRules > 3 && (
            <p className="more-rules">+{totalRules - 3} more rules</p>
          )}
        </div>
      ) : (
        <div className="no-rules">
          <p>No rules configured</p>
        </div>
      )}

      <button className="manage-btn" onClick={openOptions}>
        Manage Rules
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<PopupApp />)

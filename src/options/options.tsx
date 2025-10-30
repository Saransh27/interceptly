import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { InterceptRule } from '@/types'
import { StorageUtils } from '@/utils/storage'
import '../styles/options.css'

function OptionsApp() {
  const [rules, setRules] = useState<InterceptRule[]>([])
  const [newRule, setNewRule] = useState<Partial<InterceptRule>>({
    type: 'redirect',
    urlPattern: '',
    priority: 1,
    enabled: true,
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    try {
      const rules = await StorageUtils.getRules()
      setRules(rules)
    } catch (error) {
      console.error('Error loading rules:', error)
    }
  }

  const handleAddRule = async () => {
    if (!newRule.urlPattern) {
      alert('Please enter a URL pattern')
      return
    }

    const rule: InterceptRule = {
      id: Date.now().toString(),
      type: newRule.type as 'redirect' | 'modifyHeaders' | 'block',
      urlPattern: newRule.urlPattern,
      priority: newRule.priority || 1,
      enabled: newRule.enabled !== false,
      action: newRule.action || {
        type: newRule.type as 'redirect' | 'modifyHeaders' | 'block',
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    try {
      await StorageUtils.addRule(rule)
      setRules([...rules, rule])
      setNewRule({
        type: 'redirect',
        urlPattern: '',
        priority: 1,
        enabled: true,
      })
    } catch (error) {
      console.error('Error adding rule:', error)
    }
  }

  const handleDeleteRule = async (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      try {
        await StorageUtils.deleteRule(id)
        setRules(rules.filter(r => r.id !== id))
      } catch (error) {
        console.error('Error deleting rule:', error)
      }
    }
  }

  const handleToggleRule = async (id: string) => {
    try {
      await StorageUtils.toggleRule(id)
      setRules(
        rules.map(r =>
          r.id === id ? { ...r, enabled: !r.enabled } : r
        )
      )
    } catch (error) {
      console.error('Error toggling rule:', error)
    }
  }

  return (
    <div className="options-container">
      <header className="options-header">
        <h1>Interceptly - Rules Manager</h1>
        <p>Create and manage request interception rules</p>
      </header>

      <main className="options-main">
        {/* New Rule Form */}
        <section className="new-rule-section">
          <h2>Create New Rule</h2>
          <div className="form-group">
            <label htmlFor="rule-type">Rule Type</label>
            <select
              id="rule-type"
              value={newRule.type || 'redirect'}
              onChange={(e) =>
                setNewRule({ ...newRule, type: e.target.value as any })
              }
            >
              <option value="redirect">Redirect</option>
              <option value="block">Block</option>
              <option value="modifyHeaders">Modify Headers</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="url-pattern">URL Pattern</label>
            <input
              id="url-pattern"
              type="text"
              placeholder="e.g., *://*.example.com/*"
              value={newRule.urlPattern || ''}
              onChange={(e) =>
                setNewRule({ ...newRule, urlPattern: e.target.value })
              }
            />
          </div>

          {newRule.type === 'redirect' && (
            <div className="form-group">
              <label htmlFor="redirect-url">Redirect To URL</label>
              <input
                id="redirect-url"
                type="text"
                placeholder="https://example.com"
                value={newRule.action?.redirect?.url || ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    action: {
                      ...newRule.action,
                      type: 'redirect',
                      redirect: { url: e.target.value },
                    },
                  })
                }
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <input
              id="priority"
              type="number"
              min="1"
              max="1000"
              value={newRule.priority || 1}
              onChange={(e) =>
                setNewRule({ ...newRule, priority: parseInt(e.target.value) })
              }
            />
          </div>

          <button className="btn btn-primary" onClick={handleAddRule}>
            Add Rule
          </button>
        </section>

        {/* Rules List */}
        <section className="rules-section">
          <h2>Rules ({rules.length})</h2>
          {rules.length === 0 ? (
            <p className="no-rules">No rules created yet</p>
          ) : (
            <div className="rules-list">
              {rules.map(rule => (
                <div key={rule.id} className={`rule-item ${rule.enabled ? '' : 'disabled'}`}>
                  <div className="rule-header">
                    <div className="rule-info">
                      <span className={`rule-type-badge ${rule.type}`}>{rule.type}</span>
                      <span className="rule-pattern">{rule.urlPattern}</span>
                    </div>
                    <div className="rule-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleToggleRule(rule.id)}
                        title={rule.enabled ? 'Disable' : 'Enable'}
                      >
                        {rule.enabled ? '✓' : '✕'}
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteRule(rule.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="rule-meta">
                    <span className="meta-item">
                      Priority: <strong>{rule.priority}</strong>
                    </span>
                    <span className="meta-item">
                      Created: <strong>{new Date(rule.createdAt).toLocaleDateString()}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<OptionsApp />)

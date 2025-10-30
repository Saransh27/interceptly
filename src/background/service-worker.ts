// Service worker loaded - log immediately
console.log('[SERVICE WORKER] Script starting to load...')

// Inline types and storage to avoid import issues in service worker
interface InterceptRule {
  id: string
  type: 'redirect' | 'block' | 'modifyHeaders'
  urlPattern: string
  priority: number
  enabled: boolean
  action: any
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'interceptly_rules'
const ENABLED_KEY = 'interceptly_enabled'

const StorageUtils = {
  async getRules(): Promise<InterceptRule[]> {
    const result = await chrome.storage.sync.get(STORAGE_KEY)
    return result[STORAGE_KEY] || []
  },

  async saveRules(rules: InterceptRule[]): Promise<void> {
    await chrome.storage.sync.set({ [STORAGE_KEY]: rules })
  },

  async addRule(rule: InterceptRule): Promise<void> {
    const rules = await this.getRules()
    rules.push(rule)
    await this.saveRules(rules)
  },

  async deleteRule(id: string): Promise<void> {
    const rules = await this.getRules()
    const filtered = rules.filter(r => r.id !== id)
    await this.saveRules(filtered)
  },

  async toggleRule(id: string): Promise<void> {
    const rules = await this.getRules()
    const rule = rules.find(r => r.id === id)
    if (rule) {
      rule.enabled = !rule.enabled
      rule.updatedAt = Date.now()
      await this.saveRules(rules)
    }
  },

  async isExtensionEnabled(): Promise<boolean> {
    const result = await chrome.storage.sync.get(ENABLED_KEY)
    return result[ENABLED_KEY] !== false
  },

  async setExtensionEnabled(enabled: boolean): Promise<void> {
    await chrome.storage.sync.set({ [ENABLED_KEY]: enabled })
  },

  onStorageChange(callback: (rules: InterceptRule[], isEnabled: boolean) => void): void {
    chrome.storage.onChanged.addListener(async (changes: Record<string, chrome.storage.StorageChange>) => {
      if (changes[STORAGE_KEY] || changes[ENABLED_KEY]) {
        const rules = await this.getRules()
        const isEnabled = await this.isExtensionEnabled()
        callback(rules, isEnabled)
      }
    })
  },
}

let currentRules: InterceptRule[] = []
let isExtensionEnabled = true

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Interceptly installed!')
  
  try {
    // Set default enabled state
    await StorageUtils.setExtensionEnabled(true)
    
    // Load rules from storage
    currentRules = await StorageUtils.getRules()
    isExtensionEnabled = await StorageUtils.isExtensionEnabled()
    
    console.log(`Loaded ${currentRules.length} rules`)
    
    // Update declarative rules
    await updateDeclarativeRules()
  } catch (error) {
    console.error('Error initializing extension:', error)
  }
})

// Listen for storage changes
StorageUtils.onStorageChange(async (rules, enabled) => {
  console.log('Storage changed, updating rules...')
  currentRules = rules
  isExtensionEnabled = enabled
  try {
    await updateDeclarativeRules()
  } catch (error) {
    console.error('Error updating rules from storage change:', error)
  }
})

// Convert stored rules to declarative net request rules
async function updateDeclarativeRules() {
  if (!isExtensionEnabled || currentRules.length === 0) {
    // Clear all rules
    const existingRuleIds = await chrome.declarativeNetRequest.getSessionRules()
    if (existingRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: existingRuleIds.map(r => r.id),
      })
    }
    return
  }

  const declarativeRules = currentRules
    .filter(rule => rule.enabled)
    .map((rule, index) => {
      // Convert user-friendly pattern to Chrome's urlFilter format
      const urlFilter = convertUrlPattern(rule.urlPattern)
      
      console.log(`Converting rule: "${rule.urlPattern}" -> filter: "${urlFilter}"`)
      
      switch (rule.type) {
        case 'redirect':
          // Ensure redirect URL is valid
          let redirectUrl = rule.action.redirect?.url || ''
          if (redirectUrl && !redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
            redirectUrl = 'https://' + redirectUrl
          }
          console.log(`Redirect URL: "${rule.action.redirect?.url}" -> "${redirectUrl}"`)
          return {
            id: index + 1,
            priority: rule.priority || 1,
            condition: {
              urlFilter: urlFilter,
              resourceTypes: [
                'main_frame',
                'sub_frame',
                'stylesheet',
                'script',
                'image',
                'font',
                'object',
                'xmlhttprequest',
                'ping',
                'media',
                'websocket',
              ],
            },
            action: {
              type: 'redirect',
              redirect: {
                url: redirectUrl,
              },
            },
          } as any
        case 'modifyHeaders':
          return {
            id: index + 1,
            priority: rule.priority || 1,
            condition: {
              urlFilter: urlFilter,
              resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest'],
            },
            action: {
              type: 'modifyHeaders',
              responseHeaders: (rule.action.modifyHeaders || []).map((header: any) => ({
                header: header.header,
                operation: header.operation as 'remove' | 'set' | 'append',
                value: header.value,
              })),
            },
          } as any
        case 'block':
          return {
            id: index + 1,
            priority: rule.priority || 1,
            condition: {
              urlFilter: urlFilter,
              resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest'],
            },
            action: {
              type: 'block',
            },
          } as any
        default:
          return null
      }
    })
    .filter((rule): rule is any => rule !== null)

  console.log(`[updateDeclarativeRules] Applying ${declarativeRules.length} rules`)
  console.log('[updateDeclarativeRules] Rule details:')
  declarativeRules.forEach((rule: any) => {
    console.log(`  Rule ID ${rule.id}: ${rule.action.type} - Filter: "${rule.condition.urlFilter}"`)
  })
  
  // Update session rules
  const existingRuleIds = await chrome.declarativeNetRequest.getSessionRules()
  console.log(`[updateDeclarativeRules] Existing rules: ${existingRuleIds.length}`)
  
  try {
    const result = await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: existingRuleIds.map(r => r.id),
      addRules: declarativeRules as any,
    })
    
    console.log('[updateDeclarativeRules] UpdateSessionRules result:', result)
    
    // Verify rules were added
    const updatedRuleIds = await chrome.declarativeNetRequest.getSessionRules()
    console.log(`[updateDeclarativeRules] Rules updated successfully. Total rules now: ${updatedRuleIds.length}`)
    updatedRuleIds.forEach(rule => {
      console.log(`  Active Rule ID ${rule.id}: Condition="${JSON.stringify(rule.condition)}"`)
    })
  } catch (error: any) {
    console.error('[updateDeclarativeRules] Error updating rules:', error)
    console.error('[updateDeclarativeRules] Error message:', error.message)
    console.error('[updateDeclarativeRules] Error details:', JSON.stringify(error, null, 2))
  }
}

// Helper to convert user-friendly URL patterns to Chrome's urlFilter format
// Chrome's urlFilter uses a simpler format:
// - "google" matches any URL containing "google"
// - "|https://google.com" matches https://google.com
// - "google.com|*" matches google.com and everything after
function convertUrlPattern(pattern: string): string {
  // Trim whitespace
  pattern = pattern.trim()
  
  console.log(`Converting pattern: "${pattern}"`)
  
  // If already a valid Chrome URL filter (contains |), use as-is
  if (pattern.includes('|')) {
    console.log(`Already has pipe, using as-is: "${pattern}"`)
    return pattern
  }
  
  // For https://www.google.com/ or http://google.com patterns
  if (pattern.startsWith('http://') || pattern.startsWith('https://')) {
    // Remove trailing slash and wildcards
    let cleaned = pattern.replace(/\*$/, '').replace(/\/$/, '')
    // Use pipe format: |https://google.com
    return '|' + cleaned
  }
  
  // For domain patterns like "google.com" or "www.google.com"
  if (!pattern.includes('/')) {
    // Simple substring match - will match http://google.com, https://google.com, etc
    return pattern
  }
  
  // For patterns with paths like "google.com/search"
  // Use simple substring match
  return pattern
}

// Handle messages from popup/options
chrome.runtime.onMessage.addListener((request: any, _sender, sendResponse) => {
  console.log('Message received:', request.action)
  
  try {
    if (request.action === 'getRules') {
      console.log('Sending rules:', currentRules.length)
      sendResponse({ rules: currentRules, enabled: isExtensionEnabled })
    } else if (request.action === 'toggleExtension') {
      isExtensionEnabled = !isExtensionEnabled
      StorageUtils.setExtensionEnabled(isExtensionEnabled).catch(err => 
        console.error('Error setting extension enabled:', err)
      )
      updateDeclarativeRules().catch(err => 
        console.error('Error updating rules:', err)
      )
      sendResponse({ enabled: isExtensionEnabled })
    } else {
      console.log('Unknown action:', request.action)
    }
  } catch (error) {
    console.error('Error handling message:', error)
    sendResponse({ error: (error as any).message })
  }
  
  return true // Keep channel open for async operations
})

// Listen for rule matching events (requires declarativeNetRequestFeedback permission)
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener((details) => {
  console.log('[RULE FIRED]', {
    ruleId: details.rule.ruleId,
    request: details.request.url,
    tabId: details.request.tabId,
  })
})

console.log('[SERVICE WORKER] Interceptly background service worker fully loaded and ready!')
console.log('[SERVICE WORKER] Storage listeners registered')
console.log('[SERVICE WORKER] Message listeners registered')
console.log('[SERVICE WORKER] Rule match debug listeners registered')

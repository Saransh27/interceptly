import { InterceptRule } from '@/types'
import { StorageUtils } from '@/utils/storage'

let currentRules: InterceptRule[] = []
let isExtensionEnabled = true

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Interceptly installed!')
  
  // Set default enabled state
  await StorageUtils.setExtensionEnabled(true)
  
  // Load rules from storage
  currentRules = await StorageUtils.getRules()
  isExtensionEnabled = await StorageUtils.isExtensionEnabled()
  
  // Update declarative rules
  await updateDeclarativeRules()
})

// Listen for storage changes
StorageUtils.onStorageChange(async (rules, enabled) => {
  currentRules = rules
  isExtensionEnabled = enabled
  await updateDeclarativeRules()
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
      const urlPattern = convertUrlPatternToRegex(rule.urlPattern)
      
      switch (rule.type) {
        case 'redirect':
          return {
            id: index + 1,
            priority: rule.priority || 1,
            condition: {
              urlFilter: rule.urlPattern,
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
                'csp_report',
                'media',
                'websocket',
                'webtransport',
                'webbundle',
              ],
            },
            action: {
              type: 'redirect',
              redirect: {
                url: rule.action.redirect?.url || '',
              },
            },
          }
        case 'modifyHeaders':
          return {
            id: index + 1,
            priority: rule.priority || 1,
            condition: {
              urlFilter: rule.urlPattern,
              resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest'],
            },
            action: {
              type: 'modifyHeaders',
              responseHeaders: (rule.action.modifyHeaders || []).map(header => ({
                header: header.header,
                operation: header.operation as 'remove' | 'set' | 'append',
                value: header.value,
              })),
            },
          }
        case 'block':
          return {
            id: index + 1,
            priority: rule.priority || 1,
            condition: {
              urlFilter: rule.urlPattern,
              resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest'],
            },
            action: {
              type: 'block',
            },
          }
        default:
          return null
      }
    })
    .filter(Boolean)

  // Update session rules
  const existingRuleIds = await chrome.declarativeNetRequest.getSessionRules()
  
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: existingRuleIds.map(r => r.id),
    addRules: declarativeRules,
  })
}

// Helper to convert URL patterns
function convertUrlPatternToRegex(pattern: string): string {
  // Simple pattern to regex conversion
  // Supports * and ? wildcards
  let regex = pattern.replace(/\*/g, '.*').replace(/\?/g, '.')
  return regex
}

// Handle messages from popup/options
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'getRules') {
    sendResponse({ rules: currentRules, enabled: isExtensionEnabled })
  } else if (request.action === 'toggleExtension') {
    isExtensionEnabled = !isExtensionEnabled
    StorageUtils.setExtensionEnabled(isExtensionEnabled)
    updateDeclarativeRules()
    sendResponse({ enabled: isExtensionEnabled })
  }
})

console.log('Interceptly background service worker loaded')

import { InterceptRule } from '@/types'

const STORAGE_KEY = 'interceptly_rules'
const ENABLED_KEY = 'interceptly_enabled'

export const StorageUtils = {
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

  async updateRule(id: string, updates: Partial<InterceptRule>): Promise<void> {
    const rules = await this.getRules()
    const index = rules.findIndex(r => r.id === id)
    if (index !== -1) {
      rules[index] = { ...rules[index], ...updates, updatedAt: Date.now() }
      await this.saveRules(rules)
    }
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

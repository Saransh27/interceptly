export interface InterceptRule {
  id: string
  enabled: boolean
  type: 'redirect' | 'modifyHeaders' | 'block'
  urlPattern: string
  priority: number
  action: {
    type: 'redirect' | 'modifyHeaders' | 'block'
    redirect?: {
      url: string
    }
    modifyHeaders?: Array<{
      header: string
      operation: 'set' | 'remove' | 'append'
      value?: string
    }>
  }
  createdAt: number
  updatedAt: number
}

export interface RuleData {
  rules: InterceptRule[]
  isEnabled: boolean
}

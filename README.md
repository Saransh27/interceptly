# Interceptly - Chrome Extension Request Interceptor

A powerful Chrome extension competitor to Requestly for intercepting, modifying, and redirecting HTTP/HTTPS requests with an intuitive UI built with React + TypeScript.

## Features

- ✅ **Request Interception** - Intercept and modify web requests in real-time
- ✅ **Redirect Rules** - Redirect URLs to different destinations
- ✅ **Block Requests** - Block specific URLs from loading
- ✅ **Modify Headers** - Add, remove, or modify HTTP headers
- ✅ **Priority-Based Rules** - Control rule execution order with priorities
- ✅ **Enable/Disable Toggle** - Quick on/off switch for the extension
- ✅ **Declarative Net Request API** - Uses Chrome Manifest V3's declarativeNetRequest for performance
- ✅ **Cloud Sync** - Rules sync across devices using chrome.storage.sync
- ✅ **React + TypeScript** - Modern, type-safe UI components

## Project Structure

```
interceptly/
├── src/
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   └── storage.ts            # Chrome storage utilities
│   ├── background/
│   │   └── service-worker.ts     # Background service worker (declarative rules)
│   ├── popup/
│   │   ├── popup.html            # Popup UI entry point
│   │   └── popup.tsx             # React popup component
│   ├── options/
│   │   ├── options.html          # Options page entry point
│   │   └── options.tsx           # React rules manager
│   ├── content/
│   │   └── content-script.ts     # Content script
│   └── styles/
│       ├── popup.css             # Popup styles
│       └── options.css           # Options page styles
├── assets/                        # Extension icons
├── manifest.json                  # Chrome extension manifest
├── package.json                   # Node dependencies
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.node.json             # Node-specific TypeScript config
├── vite.config.ts                 # Vite build configuration
└── README.md                      # This file
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Chrome or Chromium-based browser

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Extension
```bash
npm run build
```

The extension will be built into the `dist/` folder.

### 3. Load into Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **"Load unpacked"**
4. Select the `dist/` folder from this project
5. The extension is now installed!

## Usage

### Development Mode (Watch)
```bash
npm run dev
```

This watches for file changes and rebuilds automatically.

### Type Checking
```bash
npm run type-check
```

Validates TypeScript without emitting files.

### Production Build
```bash
npm run build:prod
```

Optimized build with minification.

## Creating Rules

### In the Popup
Click the **Manage Rules** button to open the full rules manager.

### In the Options Page
1. Select a rule type: **Redirect**, **Block**, or **Modify Headers**
2. Enter a URL pattern (supports wildcards like `*://*.example.com/*`)
3. Configure the action based on rule type
4. Click **Add Rule**

### Rule Types

#### Redirect
Redirects matching requests to a different URL.
- **Pattern**: `*://*.example.com/api/*`
- **Redirect To**: `https://newdomain.com/api/`

#### Block
Blocks matching requests from loading.
- **Pattern**: `*://*.ads.com/*`
- **Effect**: Requests matching this pattern will be blocked

#### Modify Headers
Adds, removes, or modifies HTTP headers.
- **Pattern**: `*://*.example.com/*`
- **Headers**: Add/remove custom headers

## Architecture

### Manifest V3 Compliance
This extension uses the modern Chrome Manifest V3 API:

- **declarativeNetRequest** - High-performance request handling
- **storage.sync** - Cloud-synced rule storage
- **Service Worker** - Background script instead of background page

### Data Flow
1. User creates rules in Options page
2. Rules stored in `chrome.storage.sync` (syncs across devices)
3. Background service worker converts rules to declarative format
4. DeclarativeNetRequest API enforces rules at network level
5. Popup shows active rule count and status

## Configuration

### Permissions (manifest.json)
```json
{
  "permissions": [
    "declarativeNetRequest",
    "declarativeNetRequestFeedback",
    "storage",
    "scripting",
    "tabs",
    "webNavigation"
  ],
  "host_permissions": ["<all_urls>"]
}
```

### Storage
- `interceptly_rules` - Array of InterceptRule objects
- `interceptly_enabled` - Boolean extension enable/disable state

## API Types

### InterceptRule
```typescript
interface InterceptRule {
  id: string
  enabled: boolean
  type: 'redirect' | 'modifyHeaders' | 'block'
  urlPattern: string
  priority: number
  action: {
    type: 'redirect' | 'modifyHeaders' | 'block'
    redirect?: { url: string }
    modifyHeaders?: Array<{
      header: string
      operation: 'set' | 'remove' | 'append'
      value?: string
    }>
  }
  createdAt: number
  updatedAt: number
}
```

## Development Tips

### Debugging
1. Open `chrome://extensions/`
2. Find Interceptly and click "Details"
3. Click "Background" under "Inspect views" for service worker logs
4. Use browser DevTools on popup/options pages (right-click → Inspect)

### Testing Rules
1. Create a test rule
2. Open DevTools Network tab
3. Navigate to a matching URL
4. Verify request is intercepted/modified

### Hot Reload
After changes:
1. In `chrome://extensions/`, find Interceptly
2. Click the refresh icon
3. Changes apply immediately

## Build Configuration (Vite)

The Vite config builds multiple entry points:
- `popup/popup.html` → `dist/popup/popup.html`
- `options/options.html` → `dist/options/options.html`
- `background/service-worker.ts` → `dist/background/service-worker.js`
- `content/content-script.ts` → `dist/content/content-script.js`

Each is independently bundled and can be loaded by the manifest.

## Extending the Extension

### Adding New Rule Types
1. Update `InterceptRule` type in `src/types/index.ts`
2. Add handler in background service worker
3. Add UI in options page

### Adding Settings
1. Add new storage key constants
2. Update `StorageUtils` in `src/utils/storage.ts`
3. Add UI in options page

## Browser Compatibility
- ✅ Chrome 88+
- ✅ Chromium-based browsers (Brave, Edge, Opera)
- ❌ Firefox (uses different API)
- ❌ Safari (uses different API)

## License
MIT

## Contributing
Contributions welcome! Please submit issues and pull requests.

## Roadmap
- [ ] URL pattern UI builder
- [ ] Request/Response preview panel
- [ ] Rule import/export (JSON)
- [ ] Rule templates library
- [ ] Statistics and analytics
- [ ] Request logging and replay
- [ ] Conditional rules (based on request type, method, etc.)
- [ ] Collaboration/sharing rules

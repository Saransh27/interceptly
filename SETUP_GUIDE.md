# Interceptly - Setup & Installation Guide

## ✅ Project Successfully Built!

Your Chrome extension competitor to Requestly has been successfully created and built. Here's everything you need to know to use it.

## 🚀 Quick Start

### 1. Extension Ready
The extension is already built and ready to load:
- **Location**: `c:\Interceptly\dist\`
- **Built with**: React + TypeScript, Vite, Chrome Manifest V3

### 2. Load into Chrome

#### Step-by-step:
1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle **"Developer mode"** (top-right corner)
3. Click **"Load unpacked"** button
4. Navigate to and select: `C:\Interceptly\dist`
5. ✅ Extension installed!

You should see **Interceptly** appear in your extensions list.

## 📋 What You Get

### Core Features
- ✅ **Request Interception** - Intercept and modify HTTP/HTTPS requests
- ✅ **Redirect Rules** - Redirect URLs to different destinations
- ✅ **Block Requests** - Block specific requests from loading
- ✅ **Modify Headers** - Add, remove, or modify HTTP headers
- ✅ **Rule Priority** - Control execution order with priorities
- ✅ **Enable/Disable Toggle** - Quick on/off switch in popup
- ✅ **Cloud Sync** - Rules sync across Chrome instances
- ✅ **Modern UI** - Built with React and Tailwind CSS

### UI Components
1. **Popup Window** (click extension icon)
   - Extension enable/disable toggle
   - Active rules count
   - Quick preview of recent rules
   - "Manage Rules" button

2. **Rules Manager Page** (Options)
   - Create new rules with intuitive form
   - View all rules in one place
   - Enable/disable individual rules
   - Delete rules
   - Set rule priorities

## 🎯 How to Use

### Creating Your First Rule

#### Example: Redirect a URL
1. Click the **Interceptly** icon in Chrome toolbar
2. Click **"Manage Rules"**
3. In the form, enter:
   - **Rule Type**: Redirect
   - **URL Pattern**: `*://old-api.com/*`
   - **Redirect To**: `https://new-api.com/`
   - Click **"Add Rule"**

#### Example: Block a Domain
1. Open Rules Manager
2. Create a new rule:
   - **Rule Type**: Block
   - **URL Pattern**: `*://ads.example.com/*`
   - Click **"Add Rule"**

### URL Pattern Syntax
Use Chrome's URL pattern format:
- `*://example.com/*` - All protocols, example.com domain
- `https://api.example.com/v1/*` - Specific subdomain and path
- `*://api*.example.com/*` - Wildcard in subdomain
- `*://*/images/*` - All domains, images folder

## 🛠️ Development

### Available Commands

```bash
# Development mode (watch for changes)
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Production build with optimizations
npm run build:prod
```

### Project Structure

```
interceptly/
├── src/
│   ├── types/              # TypeScript types
│   ├── utils/              # Utilities (storage, etc)
│   ├── background/         # Service worker (rule enforcement)
│   ├── popup/              # Popup UI (React)
│   ├── options/            # Rules manager (React)
│   ├── content/            # Content script
│   └── styles/             # CSS files
├── dist/                   # ✅ Built extension (ready to load)
├── manifest.json           # Extension config
├── package.json            # Dependencies
├── vite.config.ts          # Build config
└── README.md               # Full documentation
```

## 🔍 Testing Your Rules

1. **Create a test rule**
   - Example: Redirect `https://google.com` → `https://bing.com`

2. **Open DevTools**
   - Press `F12` in Chrome
   - Go to **Network** tab

3. **Navigate to the URL**
   - Visit the URL matching your rule
   - Watch for the request being intercepted

4. **Verify it worked**
   - Check Network tab for redirects
   - Check final URL in address bar

## 🐛 Debugging

### View Extension Logs
1. Go to `chrome://extensions/`
2. Find **Interceptly**
3. Click **"Details"** → **"Background"** (under "Inspect views")
4. DevTools opens - see console logs

### Debug Popup/Options
1. Right-click on the extension icon
2. Select **"Inspect popup"**
3. DevTools opens for that page

### Reload Extension
1. In `chrome://extensions/`
2. Find Interceptly and click the **refresh icon**
3. Changes apply immediately

## 📚 API Types Reference

### InterceptRule Interface
```typescript
interface InterceptRule {
  id: string                    // Unique identifier
  enabled: boolean              // Whether rule is active
  type: 'redirect' | 'modifyHeaders' | 'block'
  urlPattern: string            // URL pattern to match
  priority: number              // Execution priority (1-1000)
  action: {
    type: string
    redirect?: { url: string }
    modifyHeaders?: Array<{
      header: string
      operation: 'set' | 'remove' | 'append'
      value?: string
    }>
  }
  createdAt: number             // Timestamp
  updatedAt: number             // Timestamp
}
```

## 🔧 Chrome Permissions Used

The extension requests:
- `declarativeNetRequest` - Intercept and modify requests
- `storage` - Save rules to Chrome sync
- `scripting` - Run scripts in pages
- `tabs` - Access tab information
- `webNavigation` - Track navigation events
- `<all_urls>` - Access all websites

## 🚨 Important Notes

### Declarative Net Request Limits
- Chrome limits to 30,000 dynamic rules
- Rules are enforced at network level (very performant)
- Changes apply immediately after modification

### URL Pattern Rules
- Use Chrome's URL matching format
- Test patterns in the console if unsure
- Wildcards work: `*` = any characters

### Storage
- Rules are saved in `chrome.storage.sync`
- Automatically syncs across your Chrome instances
- Syncs with your Google account

## 🎓 Next Steps

### To Extend the Extension:

1. **Add New Rule Types**
   - Edit `src/types/index.ts`
   - Add handler in `src/background/service-worker.ts`
   - Add UI in `src/options/options.tsx`

2. **Customize UI**
   - Modify `src/styles/popup.css` and `src/styles/options.css`
   - Update React components in popup/options folders

3. **Add Settings**
   - Update storage utilities
   - Add UI in options page

4. **Rebuild After Changes**
   ```bash
   npm run dev    # Watch mode
   # Or
   npm run build  # One-time build
   ```

5. **Reload in Chrome**
   - Click refresh icon on extension in `chrome://extensions/`

## 📦 Deployment

When ready to share:
1. Build: `npm run build:prod`
2. Zip the `dist/` folder
3. Submit to Chrome Web Store or share `.crx` file

## 🤝 Troubleshooting

### Extension won't load
- Check console for errors
- Verify `manifest.json` exists in `dist/`
- Ensure all file paths are correct

### Rules not working
- Check DevTools Background tab for errors
- Verify URL pattern matches your target
- Enable the extension toggle in popup
- Check rule priority (lower = higher priority)

### Styles look broken
- Clear cache: `Ctrl+Shift+Delete` in Chrome
- Reload extension
- Rebuild with `npm run build`

## ✨ You're All Set!

The extension is ready to use. Load it into Chrome from `dist/` folder and start creating rules!

For full documentation, see **README.md** in the project root.

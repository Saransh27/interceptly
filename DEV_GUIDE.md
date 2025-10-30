# 🚀 Interceptly - Full Development Environment

## ✅ Development Server is Running!

Your development environment is now set up with:
- ✅ **Hot reload** - Changes rebuild automatically
- ✅ **Mocked Chrome API** - Full Chrome functionality simulation
- ✅ **Web interface** - View components in browser
- ✅ **Console logging** - See all API calls

---

## 🌐 Access the Dev Environment

### Development Dashboard
```
http://127.0.0.1:5173/src/dev.html
```

The dashboard shows:
- 📱 **Component Preview Panel** - See Popup or Rules Manager
- 📋 **Console Logs Panel** - All Chrome API calls logged
- 🎛️ **Control Buttons** - Switch between views

---

## 🎯 How to Use

### 1. View the Popup Component
1. Open dev dashboard (link above)
2. Click **"View Popup"** button
3. See popup UI with mock data
4. Console logs all interactions

### 2. View the Rules Manager
1. Open dev dashboard
2. Click **"View Rules Manager"** button
3. See full rules management interface
4. Console logs all operations

### 3. Monitor API Calls
All Chrome API calls are logged:
- ✓ `chrome.storage.sync.get()`
- ✓ `chrome.storage.sync.set()`
- ✓ `chrome.runtime.sendMessage()`
- ✓ `chrome.runtime.openOptionsPage()`

---

## 📝 Mock Data

The dev environment includes 3 sample rules:

```javascript
1. Redirect Rule (ENABLED)
   Pattern: *://api.example.com/*
   Redirect: http://localhost:3000/

2. Block Rule (ENABLED)
   Pattern: *://ads.com/*

3. Redirect Rule (DISABLED)
   Pattern: *://old-domain.com/*
   Redirect: https://new-domain.com/
```

All rules are stored in `window.mockRules` and can be modified.

---

## 🔧 Development Workflow

### Make Changes to Code
1. Edit files in `src/`
2. Save file
3. Watch terminal (it rebuilds automatically)
4. Refresh browser to see changes

### Example: Add a New Rule Type

1. **Edit `src/types/index.ts`**
   ```typescript
   type RuleType = 'redirect' | 'block' | 'modifyHeaders' | 'newType'
   ```

2. **Update `src/options/options.tsx`**
   - Add UI for new type
   - Save file

3. **Watch terminal rebuilds automatically**

4. **Refresh browser to see changes**

---

## 📊 Console Logs Panel

The logs show:

```
✓ chrome.storage.sync.get called
✓ Rules loaded: 3 rules
✓ Popup rendered successfully
✕ Error messages in red
⚠ Warnings in orange
```

**Use the "Clear Logs" button to reset.**

---

## 🎨 Testing UI Components

### Test Popup Component

The popup shows:
- Extension status toggle
- Active rules count
- Quick rule preview
- "Manage Rules" button

Try:
- Click the toggle (logs the action)
- Click "Manage Rules" (opens options)

### Test Rules Manager

The rules manager shows:
- Create rule form
- Existing rules list
- Enable/disable rules
- Delete rules

Try:
- Fill in the form
- Click "Add Rule" (check console logs)
- Toggle rules on/off
- Delete a rule

---

## 🔍 Debugging Tips

### 1. View Mock Rules
Open browser console (F12) and run:
```javascript
window.mockRules
```

### 2. Add a Rule Programmatically
```javascript
window.mockRules.push({
  id: '4',
  type: 'block',
  urlPattern: '*://test.com/*',
  enabled: true,
  priority: 1,
  action: { type: 'block' },
  createdAt: Date.now(),
  updatedAt: Date.now(),
})
```

### 3. Clear Rules
```javascript
window.mockRules.length = 0
```

### 4. Log API Call
```javascript
window.addLog('Custom message', 'success', 'Details here')
```

### 5. Check Storage State
```javascript
await chrome.storage.sync.get('interceptly_rules')
```

---

## 🛠️ Common Development Tasks

### Task: Add a New Field to Rules

1. Edit `src/types/index.ts` - Add field to `InterceptRule`
2. Edit `src/options/options.tsx` - Add form input
3. Edit `src/utils/storage.ts` - Update storage logic
4. Save files - Terminal rebuilds
5. Refresh browser - See changes

### Task: Change Styling

1. Edit `src/styles/popup.css` or `src/styles/options.css`
2. Save - Terminal rebuilds
3. Refresh browser - See new styles immediately

### Task: Test Error Handling

1. Open browser console (F12)
2. Modify mock rules:
   ```javascript
   window.mockRules = []  // Clear rules
   ```
3. Refresh component to see "no rules" state

### Task: Test Storage Sync

1. Add a rule in the UI
2. Check console logs for:
   - `chrome.storage.sync.set` called
   - Check `window.mockRules` for new rule

---

## 📱 Testing Different Viewport Sizes

The dev dashboard and iframed components are responsive. Try:

1. **Mobile**: F12 → Toggle device toolbar → Select mobile
2. **Tablet**: F12 → Toggle device toolbar → Select tablet
3. **Desktop**: Resize window

All components should adapt.

---

## 🔄 File Watching & Rebuilds

Watch terminal for rebuild messages:

```
watching for file changes...
change detected: src/popup/popup.tsx
rebuilding...
✓ built in 234ms
```

Then refresh browser to see changes.

---

## 🎓 Architecture in Dev Mode

```
Your Code (src/)
    ↓
Watch for changes
    ↓
Vite rebuild
    ↓
dist/ folder updated
    ↓
http-server serves dist/
    ↓
Browser loads from http://127.0.0.1:5173
    ↓
Chrome API mocked by dev.html
    ↓
Component works with mock data
```

---

## 🧪 Testing Checklist

### Popup Component
- [ ] Toggle extension on/off
- [ ] View active rules count
- [ ] Click "Manage Rules"
- [ ] Check console logs
- [ ] Test responsive layout

### Rules Manager
- [ ] Create a redirect rule
- [ ] Create a block rule
- [ ] Create a modify headers rule
- [ ] Toggle rules on/off
- [ ] Delete a rule
- [ ] Test form validation
- [ ] Check console logs

### Storage
- [ ] Verify mock rules load
- [ ] Add rule logs to console
- [ ] Delete rule updates storage
- [ ] Toggle rule updates storage

### UI/UX
- [ ] Test mobile view
- [ ] Test tablet view
- [ ] Test dark theme (if any)
- [ ] Test button clicks
- [ ] Test form inputs

---

## 🚀 From Dev to Production

When ready to test as real extension:

1. **Stop dev server** (Ctrl+C in terminal)
2. **Build production**:
   ```bash
   npm run build:prod
   ```
3. **Load into Chrome**:
   - `chrome://extensions/`
   - Load unpacked: `dist/` folder
4. **Test with real requests**

---

## 📚 Development Resources

### File Locations
- Source code: `src/`
- Built files: `dist/`
- Styles: `src/styles/`
- Components: `src/popup/` & `src/options/`
- Background logic: `src/background/`

### Key Files to Edit
- UI: `src/popup/popup.tsx`, `src/options/options.tsx`
- Styles: `src/styles/popup.css`, `src/styles/options.css`
- Logic: `src/background/service-worker.ts`
- Storage: `src/utils/storage.ts`
- Types: `src/types/index.ts`

### Documentation
- **README.md** - Technical details
- **EXAMPLE_RULES.md** - Rule examples
- **PROJECT_SUMMARY.md** - Architecture

---

## 🐛 Troubleshooting Dev Mode

### Changes not showing?
1. Save file
2. Check terminal for rebuild message
3. Refresh browser (Ctrl+R or Cmd+R)

### Console showing errors?
1. Check browser console (F12)
2. Look at logs panel in dev dashboard
3. Check terminal for build errors

### Mock data not loading?
1. Check browser console for errors
2. Run `window.mockRules` in console
3. Verify mock rules exist

### Can't connect to server?
1. Check terminal - http-server should be running
2. Try `http://localhost:5173/src/dev.html`
3. Restart server if needed

---

## 💡 Pro Tips

**Tip 1**: Keep browser DevTools open (F12) while developing. You'll see console logs from mock API.

**Tip 2**: Edit mock rules directly in console:
```javascript
window.mockRules[0].enabled = false
```

**Tip 3**: Use browser DevTools to inspect React components:
- F12 → React DevTools tab → Inspect components

**Tip 4**: Test error states by modifying mock data:
```javascript
window.mockRules = []  // Empty rules
```

**Tip 5**: Watch the terminal for rebuild times. Faster = better!

---

## ✨ You're Ready to Develop!

Your full development environment is set up with:
- ✅ Hot reload on save
- ✅ Mocked Chrome API
- ✅ Visual dashboard
- ✅ Console logging
- ✅ Mock data
- ✅ Live component preview

**Happy developing! 🚀**

---

## 🔗 Quick Links

- **Dev Dashboard**: http://127.0.0.1:5173/src/dev.html
- **Popup Preview**: http://127.0.0.1:5173/src/popup/popup.html
- **Options Preview**: http://127.0.0.1:5173/src/options/options.html
- **Browser DevTools**: F12

---

*Keep this guide open while developing. Reference it when you need help!*

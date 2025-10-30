# 🔧 Interceptly Development - Troubleshooting

If you're having issues with the dev environment, follow this guide.

---

## ❌ Problem: URL Not Loading

### Solution 1: Check if Servers are Running

**What to do:**
1. Look at your terminal windows
2. You should see 2 running processes:
   - Terminal 1: `npm run dev` (build watcher)
   - Terminal 2: `npx http-server...` (web server)

**If NOT running:**
- Open a new terminal in `c:\Interceptly`
- Run: `npm run dev`
- Open another terminal in `c:\Interceptly\dist`
- Run: `npx http-server -p 5173 -c-1`

### Solution 2: Try Alternative URLs

Try these in order:

```
1. http://127.0.0.1:5173/src/dev.html
2. http://localhost:5173/src/dev.html
3. http://192.168.1.7:5173/src/dev.html
```

### Solution 3: Check Port 5173

Port 5173 might be in use. Try a different port:

```bash
# Use port 8000 instead
npx http-server -p 8000 -c-1

# Then visit: http://127.0.0.1:8000/src/dev.html
```

### Solution 4: Rebuild Files

```bash
# In c:\Interceptly, run:
npm run build

# Then start the server again
cd dist
npx http-server -p 5173 -c-1
```

---

## ❌ Problem: Page Loads but Shows Error

### Check Browser Console

1. Press **F12** to open DevTools
2. Click **Console** tab
3. Look for red error messages
4. Note what the error says

### Common Errors & Fixes

#### Error: "Cannot find module 'react'"
**Cause**: React not installed
**Fix**:
```bash
npm install
```

#### Error: "dev.html not found"
**Cause**: File not built
**Fix**:
```bash
npm run build
```

#### Error: "Cannot connect to localhost"
**Cause**: Server not running
**Fix**:
- Check if http-server terminal is running
- Restart with: `npx http-server -p 5173 -c-1`

---

## ❌ Problem: Components Not Showing

### Check 1: Refresh Page
- Press **Ctrl+R** or **Cmd+R**
- Or click browser refresh button

### Check 2: Click Buttons
- Click **"View Popup"** button
- Click **"View Rules Manager"** button
- Wait a few seconds for iframe to load

### Check 3: Check Console Logs
- Look at logs panel on right side
- Should show "Preview opened" message
- If not, check browser console (F12)

### Check 4: Hard Refresh Cache
- Press **Ctrl+Shift+R** (Windows)
- Or **Cmd+Shift+R** (Mac)
- This clears cache and reloads

---

## ❌ Problem: Changes Not Appearing

### Solution 1: Rebuild Not Triggered

Check terminal running `npm run dev`:
- Should show `change detected...` message
- Should show `✓ built in XXXms`

If not appearing:
- Save file again
- Make sure file is in `src/` folder
- Check file has valid syntax

### Solution 2: Browser Cache

1. Press **F12** to open DevTools
2. Right-click refresh button
3. Click **"Empty cache and hard refresh"**
4. Or press **Ctrl+Shift+R**

### Solution 3: Manual Rebuild

```bash
# In c:\Interceptly
npm run build

# Then refresh browser
```

### Solution 4: Restart Everything

```bash
# Kill servers (Ctrl+C in both terminals)

# Rebuild
npm run build

# Restart build watcher
npm run dev

# Restart http server
cd dist
npx http-server -p 5173 -c-1

# Refresh browser
```

---

## ❌ Problem: Logs Not Showing

### Check 1: Panel Exists

The logs panel should be on the right side of dashboard. If not visible:
- Dashboard may not have loaded fully
- Try refreshing page (Ctrl+R)

### Check 2: Buttons Not Working

Try clicking buttons in dashboard:
- **"View Popup"** - Should load popup in iframe
- **"View Rules Manager"** - Should load options in iframe
- **"Clear Logs"** - Should clear log messages

### Check 3: Browser Console

Open browser console (F12) and check for errors:
- Look for red errors
- Check "Console" tab
- Scroll up to see all messages

### Check 4: Check Mock API

In browser console, run:
```javascript
window.mockRules
```

Should show array of 3 rules. If undefined:
- dev.html didn't load properly
- Try refreshing page

---

## ❌ Problem: Chrome API Not Working

### Check 1: Mock API Loaded

```javascript
// In browser console (F12), run:
window.chrome
```

Should show object with storage, runtime, etc.
If undefined, mock API didn't load.

### Check 2: Check dev.html

The mock API is in `src/dev.html`. Verify:
- File exists at `src/dev.html`
- Built to `dist/src/dev.html`
- Is being served by http-server

### Check 3: Logs Panel

Check logs panel for "Chrome API mocked" message.
If not there:
- dev.html didn't load
- Try hard refresh (Ctrl+Shift+R)

---

## ❌ Problem: Rules Not Loading in Preview

### Check 1: View in Console

```javascript
// See mock rules
window.mockRules

// Should show array with 3 objects
```

### Check 2: Manually Add Rule

```javascript
// Add a test rule
window.mockRules.push({
  id: '999',
  type: 'block',
  urlPattern: '*://test.com/*',
  enabled: true,
  priority: 1,
  action: { type: 'block' },
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

// Refresh component to see it
```

### Check 3: Check Logs

Look for "Rules loaded: X rules" in logs panel.
If shows "0 rules", mock data didn't load properly.

---

## ✅ Quick Fixes (Try These First)

| Issue | Fix |
|-------|-----|
| Page won't load | Check servers running, try different URL |
| Components not showing | Click buttons, refresh page |
| Changes not appearing | Rebuild file, hard refresh browser |
| Errors in console | Check F12, read error message |
| API not working | Check window.chrome in console |
| Logs not showing | Refresh page, check logs panel |

---

## 🔍 Debugging Checklist

- [ ] Both terminals running (build watcher + http-server)
- [ ] Can access http://127.0.0.1:5173/src/dev.html
- [ ] Dashboard loads (sees title, buttons, panels)
- [ ] F12 console has no errors
- [ ] Buttons work and load components
- [ ] Logs panel shows messages
- [ ] `window.chrome` defined in console
- [ ] `window.mockRules` shows 3 rules

If all checked ✓, environment is working!

---

## 🚀 Nuclear Option: Start Fresh

If nothing works, start completely fresh:

```bash
# Close all terminals (Ctrl+C)

# Clear everything
npm run build

# Delete dist to be safe
rm -r dist

# Rebuild
npm run build

# Start fresh
npm run dev

# In new terminal
cd dist
npx http-server -p 5173 -c-1

# Open URL
http://127.0.0.1:5173/src/dev.html
```

---

## 📞 Still Having Issues?

### Verify These Files Exist
- `src/dev.html` - Dev dashboard source
- `dist/src/dev.html` - Built dev dashboard
- `dist/dev.js` - Compiled dev script

### Check Terminal Output

Look for these messages:
```
✓ built in XXXms  ← Good: build successful
http-server version: 14.1.1  ← Good: server running
Available on: http://127.0.0.1:5173  ← Good: server started
```

### Try Manual Server

Instead of npm scripts, try:
```bash
# Go to dist folder
cd c:\Interceptly\dist

# Start server directly
npx http-server -p 5173
```

Then visit: `http://127.0.0.1:5173/src/dev.html`

---

## 💡 Pro Tips

**Tip 1**: Keep both terminals visible
- Build watcher (left) shows rebuild messages
- Http-server (right) shows request logs

**Tip 2**: Monitor terminal for issues
- Build errors appear in left terminal
- Server errors appear in right terminal

**Tip 3**: Check browser DevTools
- F12 → Console for JavaScript errors
- F12 → Network for failed requests
- F12 → Application for storage/cache

**Tip 4**: Use different port if 5173 busy
```bash
npx http-server -p 8000 -c-1
```

**Tip 5**: Check files are being built
```bash
# In dist folder, should exist:
- src/dev.html
- dev.js
- popup.js
- options.js
- client.js
- All CSS files
```

---

## 📚 Related Files

- **DEV_SETUP.md** - Quick overview
- **DEV_GUIDE.md** - Full development guide
- **src/dev.html** - Dashboard source
- **dist/src/dev.html** - Built dashboard

---

**Still stuck? Check the documentation files above or try the "Nuclear Option"!** 🚀

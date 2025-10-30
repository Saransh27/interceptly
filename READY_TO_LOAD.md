# ✅ Extension Built Successfully!

## 🎉 manifest.json is Now in dist/

Fixed! The manifest.json is now being copied to `C:\Interceptly\dist\` during the build.

---

## 🚀 Load in Firefox

1. **Open Firefox**
2. **Go to**: `about:debugging#/runtime/this-firefox`
3. **Click**: "Load Temporary Add-on"
4. **Select**: `C:\Interceptly\dist\manifest.json`
5. ✅ Extension loads!

---

## 🚀 Load in Chrome

1. **Open Chrome**
2. **Go to**: `chrome://extensions/`
3. **Enable**: "Developer mode" (top-right)
4. **Click**: "Load unpacked"
5. **Select**: `C:\Interceptly\dist\`
6. ✅ Extension loads!

---

## 🧪 Test the Extension

1. Click the **Interceptly** icon in your browser toolbar
2. Click **"Manage Rules"**
3. Try creating a test rule:
   - **Type**: Block
   - **URL Pattern**: `example.com/*`
4. Click **"Add Rule"**
5. Navigate to any example.com URL
6. ✅ Request blocked!

---

## 📝 Example Rules to Try

### Block Ads
```
Type: Block
URL Pattern: https://pagead*.googlesyndication.com/*
```

### Redirect to Local Dev
```
Type: Redirect
URL Pattern: https://api.production.com/*
Redirect To: http://localhost:3000
```

### Add Auth Header
```
Type: Modify Headers
URL Pattern: https://api.example.com/*
Header Name: Authorization
Header Value: Bearer YOUR_TOKEN
```

---

## 🛠️ Future Rebuilds

After editing source files in `src/`:

```bash
npm run build
```

Then reload the extension:
- **Firefox**: Click reload icon next to extension in `about:debugging`
- **Chrome**: Click refresh icon (🔄) on extension in `chrome://extensions/`

---

## ✨ You're All Set!

Extension is built and ready to load! 🚀

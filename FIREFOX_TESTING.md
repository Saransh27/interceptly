# 🔧 Firefox Testing Guide for Interceptly

## ⚠️ MIME Type Issue

Firefox blocks loading TypeScript files directly (`.tsx`, `.ts`) with MIME type errors. This is **NOT** a bug - it's how Firefox handles security.

---

## ✅ Solution: Use the Built Extension

The extension is **already built** in `C:\Interceptly\dist\`. Just load that!

### For Firefox:

1. **Open Firefox**
2. **Go to**: `about:debugging#/runtime/this-firefox`
3. **Click**: "Load Temporary Add-on"
4. **Select**: `C:\Interceptly\dist\manifest.json`
5. ✅ Extension loads!

### For Chrome:

1. **Open Chrome**
2. **Go to**: `chrome://extensions/`
3. **Enable**: "Developer mode" (top-right)
4. **Click**: "Load unpacked"
5. **Select**: `C:\Interceptly\dist\`
6. ✅ Extension loads!

---

## 🎯 Why Use `dist/` Folder?

| Folder | What It Contains | Use Case |
|--------|------------------|----------|
| **`src/`** | Source code (TypeScript, React JSX) | Editing & development |
| **`dist/`** | Compiled & built extension | Loading into browsers |

The `dist/` folder has:
- ✅ Compiled JavaScript (no TypeScript)
- ✅ Bundled React components
- ✅ Compiled CSS files
- ✅ Ready-to-load manifest.json

---

## 🚀 Quick Start (Use This!)

### Build the Extension First
```bash
cd c:\Interceptly
npm run build
```

### Then Load in Browser

**Firefox:**
```
about:debugging#/runtime/this-firefox
→ Load Temporary Add-on
→ Select: C:\Interceptly\dist\manifest.json
```

**Chrome:**
```
chrome://extensions/
→ Enable Developer mode
→ Load unpacked
→ Select: C:\Interceptly\dist\
```

---

## 📝 Development Workflow

### Step 1: Edit Source Files
```bash
# Edit files in src/
# Example: src/options/options.tsx
```

### Step 2: Build
```bash
npm run build
```

### Step 3: Reload in Browser

**Firefox:**
- Press the reload icon next to the extension in `about:debugging`

**Chrome:**
- Click the refresh icon (🔄) on the extension in `chrome://extensions/`

### Step 4: Test
- Click extension icon
- Test your changes

---

## 🛠️ Commands

```bash
# Build extension (creates dist/)
npm run build

# Watch for changes (auto-rebuild)
npm run dev

# Type checking
npm run type-check

# Production build
npm run build:prod
```

---

## ✨ The HTTP Server (Not Needed for Extension)

The HTTP server on port 5173 was for **testing components in isolation** (showing popup/options without loading as extension).

For actual extension testing, just use:
- **Firefox**: `about:debugging`
- **Chrome**: `chrome://extensions/`
- **Load from**: `C:\Interceptly\dist\`

---

## 🎯 Why You Saw the Error

When you tried to load the TypeScript files directly via HTTP server:
```
http://127.0.0.1:5173/src/options/options.tsx
```

Firefox said: "I can't execute `.tsx` files (MIME type `application/octet-stream`)"

This is **correct behavior** - you should load the **built** JavaScript files instead, which are in `dist/`.

---

## ✅ The Fix: Use Built Extension

Instead of:
```
❌ http://127.0.0.1:5173/src/options/options.tsx
```

Do this:
```
✅ Load C:\Interceptly\dist\ as a Chrome extension
✅ Load C:\Interceptly\dist\manifest.json in Firefox
```

---

## 📋 Checklist

- [ ] Run `npm run build`
- [ ] Open Firefox → `about:debugging#/runtime/this-firefox`
- [ ] Click "Load Temporary Add-on"
- [ ] Select `C:\Interceptly\dist\manifest.json`
- [ ] ✅ Extension loads!
- [ ] Click extension icon → "Manage Rules"
- [ ] Create a test rule
- [ ] ✅ It works!

---

## 🎉 You're Set!

The extension is **already built and ready**. Just load it from `dist/` in Firefox or Chrome!

No need for the HTTP server when testing as a real extension. 🚀

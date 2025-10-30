# Interceptly - Example Rules

Here are some practical examples you can use with Interceptly. Copy these into the Rules Manager!

## 📖 How to Use These Examples

1. Open Chrome extension popup (click Interceptly icon)
2. Click **"Manage Rules"**
3. Fill in the form with the values from examples below
4. Click **"Add Rule"**
5. The rule is immediately active!

---

## 🔄 Redirect Rules

### Example 1: Redirect API to Localhost
**Use Case**: Redirect API calls to your local development server
```
Rule Type:    Redirect
URL Pattern:  *://api.example.com/*
Redirect To:  http://localhost:3000/
Priority:     1
```

### Example 2: Redirect Old Domain to New Domain
**Use Case**: Migrate to a new domain
```
Rule Type:    Redirect
URL Pattern:  *://old-domain.com/*
Redirect To:  https://new-domain.com/
Priority:     1
```

### Example 3: Force HTTP to HTTPS
**Use Case**: Test HTTPS behavior
```
Rule Type:    Redirect
URL Pattern:  http://example.com/*
Redirect To:  https://example.com/
Priority:     1
```

### Example 4: Redirect Static Assets
**Use Case**: Serve assets from CDN instead
```
Rule Type:    Redirect
URL Pattern:  *://example.com/images/*
Redirect To:  https://cdn.example.com/images/
Priority:     2
```

---

## 🚫 Block Rules

### Example 1: Block All Analytics
**Use Case**: Don't send analytics
```
Rule Type:    Block
URL Pattern:  *://analytics.google.com/*
Priority:     1
```

### Example 2: Block Ads Domain
**Use Case**: Block ads from a domain
```
Rule Type:    Block
URL Pattern:  *://*.ads.example.com/*
Priority:     1
```

### Example 3: Block Social Media Trackers
**Use Case**: Block Facebook pixel
```
Rule Type:    Block
URL Pattern:  *://connect.facebook.net/*
Priority:     1
```

### Example 4: Block Specific Path
**Use Case**: Block a tracking endpoint
```
Rule Type:    Block
URL Pattern:  *://api.example.com/tracking/*
Priority:     1
```

---

## 🔧 Modify Headers Rules

### Example 1: Add Authentication Header
**Use Case**: Add JWT token to all requests
```
Rule Type:      Modify Headers
URL Pattern:    *://api.example.com/*
Header:         Authorization
Operation:      set
Value:          Bearer YOUR_TOKEN_HERE
Priority:       1
```

### Example 2: Add Custom User-Agent
**Use Case**: Test with different user agent
```
Rule Type:      Modify Headers
URL Pattern:    *://example.com/*
Header:         User-Agent
Operation:      set
Value:          Mozilla/5.0 Custom Testing
Priority:       1
```

### Example 3: Add CORS Headers
**Use Case**: Test cross-origin requests
```
Rule Type:      Modify Headers
URL Pattern:    *://api.example.com/*
Header:         Access-Control-Allow-Origin
Operation:      set
Value:          *
Priority:       1
```

### Example 4: Remove Tracking Header
**Use Case**: Don't send tracking info
```
Rule Type:      Modify Headers
URL Pattern:    *://example.com/*
Header:         X-Tracking-ID
Operation:      remove
Priority:       1
```

---

## 🎯 Common Use Cases

### Development/Testing Workflow
```
1. Redirect production API to localhost
   Type:    Redirect
   Pattern: *://api.prod.com/*
   To:      http://localhost:3000/

2. Block external analytics
   Type:    Block
   Pattern: *://analytics.*/*

3. Add dev authentication
   Type:    Modify Headers
   Pattern: *://localhost:*/*
   Header:  X-Dev-Mode
   Value:   true
```

### Migration Testing
```
1. Redirect old domain to new
   Type:    Redirect
   Pattern: *://old.com/*
   To:      https://new.com/

2. Block old domain assets
   Type:    Block
   Pattern: *://cdn.old.com/*

3. Ensure new domain rules work
```

### Security Testing
```
1. Block sensitive endpoints
   Type:    Block
   Pattern: *://api.com/admin/*

2. Remove auth tokens
   Type:    Modify Headers
   Pattern: *://third-party.com/*
   Header:  Authorization
   Op:      remove

3. Add testing headers
   Type:    Modify Headers
   Pattern: *://example.com/*
   Header:  X-Testing-Mode
   Value:   true
```

---

## 💡 Tips & Tricks

### Rule Priority
- **Lower numbers = Higher priority**
- Rules with priority 1 execute before priority 2
- Example: Set blocking rules to priority 1, redirects to priority 2

### URL Patterns
- `*://` = any protocol (http, https, etc)
- `*` in path = any characters
- Be specific to avoid unintended matches

### Testing
1. Open DevTools Network tab (F12)
2. Create your rule
3. Reload the page
4. Watch requests in Network tab

### Debugging Rules
1. Check extension background logs:
   - `chrome://extensions/` → Interceptly → Details → Background
2. Look for rule IDs and patterns
3. Enable/disable rules to isolate issues

---

## 🔐 Security Notes

- ⚠️ **Be careful with header modifications** - Don't expose sensitive data
- ⚠️ **Test before deploying** - Rules affect all matching URLs
- ⚠️ **Use priorities wisely** - Avoid conflicting rules
- ✅ **Use specific patterns** - Don't use too broad patterns like `*://*/*`

---

## 📝 Notes

- Rules are **immediately active** after adding
- Click the toggle button in the rule row to disable without deleting
- Edit rules by deleting and recreating
- All rules sync across Chrome instances
- Rules persist after browser restart

Enjoy! 🚀

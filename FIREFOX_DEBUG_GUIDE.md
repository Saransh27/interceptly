# 🔍 Firefox Debugging Guide for Interceptly

## Step 1: Open Background Console

1. **Go to**: `about:debugging#/runtime/this-firefox`
2. **Find "Interceptly"** in the list
3. **Click "Inspect"** (next to "Background script")
4. A DevTools window opens showing the background script console
5. **Go to Console tab** (if not already there)

## Step 2: Reload Extension

1. In DevTools, press **F5** to reload
2. Or go back to `about:debugging`, find Interceptly, click refresh icon
3. **Watch console** - you should see:
   ```
   Interceptly background service worker loaded
   ```

## Step 3: Test Adding a Rule

1. **Go to Rules Manager** (click extension icon → "Manage Rules")
2. **Fill in form:**
   - **Rule Type**: Block
   - **URL Pattern**: `google.com`
   - Click **"Add Rule"**
3. **Watch the console** for logs:
   ```
   Add rule clicked, newRule: {...}
   New rule object: {...}
   Attempting to add rule...
   Rule added successfully
   Form reset
   ```

4. **Then watch the background console:**
   ```
   Converting pattern: "google.com"
   Converting rule: "google.com" -> filter: "google.com"
   Updating 1 rules
   Existing rules: 0
   Rules updated successfully
   ```

## Step 4: Test the Rule

1. **Navigate to**: `https://www.google.com/`
2. The page should be **blocked** (if rule is working)
3. **Check Network tab** in DevTools - request should show as blocked

## Step 5: Check for Errors

If you see **errors** in console, tell me:
- Exact error message
- Full error stack trace
- When it appears (on reload? on add rule? on navigation?)

---

## Common Issues & Solutions

### Issue: "Converting pattern" not showing in console
- **Cause**: Rule not being added to storage
- **Fix**: Check options console for errors first

### Issue: No logs at all
- **Cause**: Background script not loaded
- **Fix**: Reload extension from `about:debugging`

### Issue: Rule shows in list but doesn't block
- **Cause**: URL filter not matching
- **Fix**: Try different patterns like:
  - `google.com`
  - `|https://www.google.com`
  - `www.google.com`

### Issue: Storage error
- **Cause**: Addon ID not set or permission issue
- **Fix**: Check manifest has `browser_specific_settings` section

---

## URL Patterns to Test

| Pattern | Should Block |
|---------|--------------|
| `google.com` | google.com, www.google.com, google.com/* |
| `|https://google.com` | Exact: https://google.com |
| `www.google.com` | www.google.com only |
| `doubleclick` | Any URL containing "doubleclick" |

---

## Getting Help

When you have errors, tell me:
1. **What pattern you used**
2. **Exact error message from console**
3. **Whether you see "Converting pattern" logs**
4. **Whether "Updating X rules" logs appear**

Then I can fix it! 🎯

# 🔐 Fix GitHub Authentication Issue

## Problem
```
remote: Permission to Saransh27/interceptly.git denied to ImSaranshMehra.
```

This means Git is trying to authenticate as `ImSaranshMehra` but the repo is owned by `Saransh27`.

---

## ✅ Solution: Update Git Credentials

### Option 1: Update Git Config (Recommended)

```bash
# Set git config for THIS repository only
cd c:\Interceptly

# Set user for this repo
git config user.name "Saransh27"
git config user.email "your.email@gmail.com"

# Verify it worked
git config user.name
git config user.email

# Now try pushing again
git push -u origin main
```

---

### Option 2: Clear & Reconfigure Global Credentials

If you want to change your global git config:

```bash
# Clear old credentials
git config --global --unset user.name
git config --global --unset user.email

# Set new credentials
git config --global user.name "Saransh27"
git config --global user.email "your.email@gmail.com"

# Verify
git config --global user.name
git config --global user.email

# From Interceptly folder, push again
cd c:\Interceptly
git push -u origin main
```

---

### Option 3: Clear Windows Credential Manager (Best Fix)

Windows saves GitHub credentials. You may need to clear them:

#### **For Windows:**

1. **Open Credential Manager**
   - Press `Win + R`
   - Type: `control /name Microsoft.CredentialManager`
   - Press Enter

2. **Find GitHub Credentials**
   - Look for entries like:
     - `git:https://github.com`
     - `github.com`
     - `ImSaranshMehra` entries

3. **Delete Old Credentials**
   - Click each GitHub entry
   - Click "Remove"

4. **Or use PowerShell** to clear:
   ```powershell
   cmdkey /delete:git:https://github.com
   ```

---

### Option 4: Use Personal Access Token (Most Reliable)

This is the most reliable method:

#### **Step 1: Create Token in Saransh27 Account**

1. Login to https://github.com/Saransh27
2. Go to Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Click "Generate new token (classic)"
4. Fill in:
   - **Note**: `Interceptly`
   - **Expiration**: 90 days or more
   - **Scopes**: Check `repo`
5. Click "Generate token"
6. **COPY THE TOKEN** (save it!)

#### **Step 2: Configure Git to Use Token**

```bash
cd c:\Interceptly

# Set git to use token-based auth
git config --global user.name "Saransh27"
git config --global user.email "your.email@gmail.com"

# Remove old remote
git remote remove origin

# Add remote with token
git remote add origin https://Saransh27:YOUR_TOKEN_HERE@github.com/Saransh27/interceptly.git

# Replace YOUR_TOKEN_HERE with your actual token!

# Now push
git push -u origin main
```

**Example with token:**
```bash
git remote add origin https://Saransh27:ghp_abcd1234efgh5678ijkl9999mnop@github.com/Saransh27/interceptly.git
```

---

## 🚀 Quick Fix (Try This First)

Run these commands in order:

```bash
cd c:\Interceptly

# Step 1: Clear old config
git config --global --unset user.name
git config --global --unset user.email

# Step 2: Set Saransh27 credentials
git config --global user.name "Saransh27"
git config --global user.email "your.email@gmail.com"

# Step 3: Verify
git config --global user.name

# Step 4: Clear old remote
git remote remove origin

# Step 5: Add correct remote
git remote add origin https://github.com/Saransh27/interceptly.git

# Step 6: Try pushing
git push -u origin main
```

When prompted for password, use your **Personal Access Token** (not your GitHub password).

---

## 📋 Step-by-Step Fix

### 1. Check current remote
```bash
cd c:\Interceptly
git remote -v
```

You should see something like:
```
origin  https://github.com/Saransh27/interceptly.git (fetch)
origin  https://github.com/Saransh27/interceptly.git (push)
```

### 2. Update credentials
```bash
# Remove old credentials from Windows
cmdkey /delete:git:https://github.com

# Or go to: Settings → Credential Manager → Remove GitHub entries
```

### 3. Try push again
```bash
cd c:\Interceptly
git push -u origin main
```

### 4. When prompted:
- **Username**: `Saransh27`
- **Password**: Use Personal Access Token (create one if needed)

---

## 🔑 Personal Access Token Method (Easiest)

If the above doesn't work, use this method:

```bash
cd c:\Interceptly

# Remove old remote
git remote remove origin

# Add remote with embedded token
git remote add origin https://Saransh27:YOUR_GITHUB_TOKEN@github.com/Saransh27/interceptly.git

# Push (won't ask for credentials)
git push -u origin main
```

**Steps to get token:**
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Give it `repo` scope
4. Copy the token
5. Use it in the command above

---

## ⚠️ Important Notes

- ❌ Don't use your GitHub password in commands
- ✅ Use Personal Access Token instead
- ⚠️ Token is valid for one time only - copy it immediately
- 🔒 Don't share your token with anyone
- 💾 If token is lost, generate a new one

---

## 🆘 Still Having Issues?

### Check what git thinks your credentials are:
```bash
git config --global user.name
git config --global user.email
git remote -v
```

### Check Windows Credential Manager:
```bash
cmdkey /list
```

### Clear everything and start fresh:
```bash
# Remove all GitHub credentials from Windows
cmdkey /delete:git:https://github.com

# Clear git config
git config --global --unset-all user.name
git config --global --unset-all user.email

# Start over with correct credentials
git config --global user.name "Saransh27"
git config --global user.email "your.email@gmail.com"
```

---

## ✅ Verify Success

After running `git push -u origin main`, you should see:

```
Enumerating objects: ...
Counting objects: 100% ...
Compressing objects: 100% ...
Writing objects: 100% ...
Total ... (delta ...), reused ... (delta ...)
remote: Resolving deltas: 100% (...)
To https://github.com/Saransh27/interceptly.git
 * [new branch]      main -> main
Branch 'main' is set to track remote branch 'main' from 'origin'.
```

Then visit: https://github.com/Saransh27/interceptly

---

## 📝 Commands Summary

```bash
# Fix the issue
cd c:\Interceptly
git config --global user.name "Saransh27"
git config --global user.email "your.email@gmail.com"
cmdkey /delete:git:https://github.com
git remote remove origin
git remote add origin https://github.com/Saransh27/interceptly.git

# Try push
git push -u origin main
```

---

**Let me know which step you're on and if you need more help!** 🚀

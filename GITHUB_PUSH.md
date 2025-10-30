# 🚀 Push Interceptly to GitHub

Complete step-by-step guide to push your project to your own GitHub account.

---

## 📋 Prerequisites

Before starting, you need:

✅ **GitHub Account** - Free at [github.com](https://github.com)
✅ **Git Installed** - Already checked ✓
✅ **Git Configured** - Configure below

---

## 🔧 Step 1: Configure Git (One-time Setup)

Run these commands to set your GitHub identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Example:**
```bash
git config --global user.name "John Doe"
git config --global user.email "john@example.com"
```

Then verify:
```bash
git config --global user.name
git config --global user.email
```

---

## 📝 Step 2: Create Repository on GitHub

### Method A: Via GitHub Website (Easiest)

1. **Login to GitHub**
   - Go to [github.com](https://github.com)
   - Sign in to your account

2. **Create New Repository**
   - Click **+** (top-right) → **New repository**
   - Fill in details:
     - **Repository name**: `interceptly`
     - **Description**: `Chrome extension request interceptor and modifier - Requestly competitor`
     - **Public** or **Private**: Choose your preference
     - **DO NOT** initialize with README (we have one already)

3. **Create Repository**
   - Click "Create repository"
   - You'll see instructions on next page

4. **Copy the HTTPS URL**
   - Look for green "Code" button
   - Copy the HTTPS URL (looks like: `https://github.com/yourname/interceptly.git`)

---

## 🔐 Step 3: Create GitHub Personal Access Token

This replaces passwords for authentication:

1. **Go to GitHub Settings**
   - Login to GitHub
   - Click profile → **Settings** (bottom-left)

2. **Developer Settings**
   - Left sidebar → **Developer settings**
   - Click **Personal access tokens** → **Tokens (classic)**

3. **Generate New Token**
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - Fill in:
     - **Note**: `Interceptly Push`
     - **Expiration**: 90 days (or longer)
     - **Scopes**: Check `repo` (all sub-boxes auto-checked)

4. **Copy Token**
   - Click "Generate token"
   - **⚠️ COPY AND SAVE THIS TOKEN** (you won't see it again)
   - Paste it somewhere safe temporarily

---

## 📤 Step 4: Initialize Local Git & Push

### Run These Commands:

```bash
cd c:\Interceptly

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Interceptly - Chrome extension request interceptor"

# Add remote (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/interceptly.git

# Push to GitHub (use token as password when prompted)
git branch -M main
git push -u origin main
```

---

## 🔑 Step-by-Step (With Details)

### 1️⃣ Navigate to Project
```bash
cd c:\Interceptly
```

### 2️⃣ Initialize Git
```bash
git init
```

Output:
```
Initialized empty Git repository in C:/Interceptly/.git/
```

### 3️⃣ Add All Files
```bash
git add .
```

### 4️⃣ Create Initial Commit
```bash
git commit -m "Initial commit: Interceptly - Chrome extension request interceptor"
```

Output:
```
[main (root-commit) abc1234] Initial commit
 35 files changed, 5000 insertions(+)
```

### 5️⃣ Add Remote Repository
```bash
git remote add origin https://github.com/YOUR_USERNAME/interceptly.git
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### 6️⃣ Rename Branch to Main
```bash
git branch -M main
```

### 7️⃣ Push to GitHub
```bash
git push -u origin main
```

**When prompted for password:**
- Username: `YOUR_USERNAME`
- Password: **Paste the token you created earlier** (not your actual password)

---

## ✅ Verify It Worked

1. **Go to GitHub**
   - Visit: `https://github.com/YOUR_USERNAME/interceptly`
   - You should see your code!

2. **Check Files**
   - README.md should be visible
   - All source files in `src/`
   - `manifest.json`
   - `package.json`

3. **Confirm Success**
   - Repository shows your files
   - Commit history visible
   - Green checkmark next to files

---

## 🔄 Future Commits & Pushes

After you make changes:

```bash
# See what changed
git status

# Add changed files
git add .

# Create commit
git commit -m "Description of changes"

# Push to GitHub
git push
```

**Shorter version (next time):**
```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 🚫 Things to Avoid

❌ **Don't push:**
- `node_modules/` - Git ignores this ✓
- `.env` files - Already in `.gitignore` ✓
- Personal tokens - Never commit these

✅ **Already set up:**
- `.gitignore` file exists
- Excludes unnecessary files automatically

---

## 📋 Quick Command Reference

```bash
# First time only (one-time config)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Initialize repository
git init

# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Commit message"

# Add remote (first time)
git remote add origin https://github.com/USERNAME/interceptly.git

# Set upstream (first time)
git push -u origin main

# Push changes (after first time)
git push

# View commit history
git log --oneline

# View remote URL
git remote -v
```

---

## 🆘 Troubleshooting

### Problem: "Permission denied"
**Solution**: 
- Make sure you're using the Personal Access Token (not password)
- Create a new token if needed
- Copy the EXACT URL from your GitHub repo

### Problem: "fatal: not a git repository"
**Solution**:
```bash
cd c:\Interceptly
git init
```

### Problem: "Could not resolve host"
**Solution**: Check your internet connection

### Problem: "Branch 'main' set up to track..."
**That's normal!** It means it worked.

### Problem: "Changes not showing on GitHub"
**Solution**:
1. Refresh GitHub page
2. Check if you're on the right branch (`main`)
3. Verify the push succeeded (no error messages)

---

## 🎯 What Happens Next

After pushing to GitHub:

✅ Your code is backed up online
✅ Others can view your project
✅ You can submit to Chrome Web Store from here
✅ You can share the link with others
✅ You have version control history

---

## 🌟 Optional: Make it Awesome

### Add a Cover Image
1. Create a screenshot of the extension
2. Save as `screenshot.png`
3. Add to repository
4. Reference in README

### Add GitHub Actions
Create `.github/workflows/build.yml`:
```yaml
name: Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build:prod
```

### Add Badges to README
```markdown
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
```

---

## 📚 Next Steps

1. **Follow the steps above** to push to GitHub
2. **Share your repository URL** with others
3. **Submit to Chrome Web Store** (optional):
   - Developer account required
   - Upload `dist/` folder as ZIP
   - Pay one-time $5 fee

4. **Keep it updated:**
   - Make changes to `src/`
   - Run `git add .` → `git commit -m "..."` → `git push`

---

## 🔗 Useful Links

- **GitHub**: https://github.com
- **Personal Access Token**: https://github.com/settings/tokens
- **Git Documentation**: https://git-scm.com/doc
- **GitHub Help**: https://docs.github.com

---

## ✨ You're Ready!

Your Interceptly project is ready to push to GitHub. Follow the steps above and you'll have your code safely backed up online!

**Questions?** GitHub has excellent documentation for any issues.

---

**Happy coding! 🚀**

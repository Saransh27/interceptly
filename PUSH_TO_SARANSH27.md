# 📤 Push Interceptly to GitHub Account: Saransh27

Complete guide to push your project to **Saransh27** GitHub account.

---

## ✅ Quick Steps (For You)

### Step 1: Create Repository on GitHub
1. Go to https://github.com/Saransh27
2. Click **+** (top-right) → **New repository**
3. Fill in:
   - **Repository name**: `interceptly`
   - **Description**: `Chrome extension request interceptor - Requestly competitor`
   - **Public**: Yes (recommended)
   - **Do NOT** initialize with README
4. Click **"Create repository"**
5. **Copy the HTTPS URL** from the green "Code" button

---

### Step 2: Configure Git with Saransh27 Account

```bash
cd c:\Interceptly

# Configure git (one-time)
git config --global user.name "Saransh27"
git config --global user.email "your.email@example.com"
```

**Replace `your.email@example.com` with your actual email**

---

### Step 3: Initialize Local Repository & Push

```bash
cd c:\Interceptly

# Initialize git
git init

# Add all files
git add .

# Create commit
git commit -m "Initial commit: Interceptly - Chrome extension request interceptor"

# Add remote (replace PASTE_YOUR_URL with the URL from Step 1)
git remote add origin https://github.com/Saransh27/interceptly.git

# Set main branch and push
git branch -M main
git push -u origin main
```

**When prompted for password:**
- Username: `Saransh27`
- Password: Use a **GitHub Personal Access Token** (see below)

---

## 🔑 Create Personal Access Token (Required)

This is easier than using a password:

### Steps:

1. **Login to GitHub as Saransh27**
   - Go to https://github.com and login

2. **Go to Settings**
   - Click your profile icon (top-right)
   - Click **Settings**

3. **Developer Settings**
   - Left sidebar → **Developer settings**
   - Click **Personal access tokens** → **Tokens (classic)**

4. **Generate New Token**
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - Fill in:
     - **Note**: `Interceptly`
     - **Expiration**: 90 days (or longer)
   - Scroll down and check **`repo`** (all sub-options auto-check)

5. **Copy Token**
   - Click **"Generate token"**
   - **COPY THE TOKEN** (shows only once!)
   - Save it temporarily

---

## 🚀 Full Command Sequence

Run these commands in order:

```bash
# Navigate to project
cd c:\Interceptly

# Configure git (one-time only)
git config --global user.name "Saransh27"
git config --global user.email "your.email@gmail.com"

# Initialize repository
git init

# Check what will be added
git status

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Interceptly - Chrome extension request interceptor"

# Add remote (use the URL from your GitHub repo)
git remote add origin https://github.com/Saransh27/interceptly.git

# Rename branch to main
git branch -M main

# Push to GitHub (will prompt for credentials)
git push -u origin main
```

---

## 🔐 When Git Asks for Password

You'll see something like:
```
fatal: could not read Username for 'https://github.com': No such file or directory
```

Or a popup asking for credentials:

**Enter:**
- **Username**: `Saransh27`
- **Password**: Paste the Personal Access Token you created above

---

## ✅ Verify It Worked

After pushing, verify:

1. **Go to your repository:**
   - https://github.com/Saransh27/interceptly

2. **You should see:**
   - All your files listed
   - `README.md` displayed
   - `package.json` visible
   - `src/` folder with code
   - Recent commit in history

3. **Check the commit:**
   - Look at the commit list
   - Should show "Initial commit" with today's date

---

## 🔄 Future Updates

After making changes to your code:

```bash
# From c:\Interceptly directory
git add .
git commit -m "Description of what changed"
git push
```

---

## 📋 Example Walkthrough

Here's what it looks like when you run the commands:

```
PS C:\Interceptly> git init
Initialized empty Git repository in C:/Interceptly/.git/

PS C:\Interceptly> git config --global user.name "Saransh27"
PS C:\Interceptly> git config --global user.email "saransh@example.com"

PS C:\Interceptly> git add .

PS C:\Interceptly> git commit -m "Initial commit: Interceptly"
[main (root-commit) a1b2c3d] Initial commit: Interceptly
 45 files changed, 5234 insertions(+)

PS C:\Interceptly> git remote add origin https://github.com/Saransh27/interceptly.git

PS C:\Interceptly> git branch -M main

PS C:\Interceptly> git push -u origin main
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
Delta compression using up to 8 threads
Compressing objects: 100% (38/38), done.
Writing objects: 100% (45/45), 234.56 KiB | 1.23 MiB/s, done.
Total 45 (delta 2), reused 0 (delta 0), recieved 0
remote: Resolving deltas: 100% (2/2), done.
To https://github.com/Saransh27/interceptly.git
 * [new branch]      main -> main
Branch 'main' is set to track remote branch 'main' from 'origin'.

✅ SUCCESS! Code is now on GitHub
```

---

## 🎯 Next Steps After Pushing

1. **Verify on GitHub**
   - Visit https://github.com/Saransh27/interceptly
   - Confirm all files are there

2. **Add Description** (Optional)
   - Go to repo settings
   - Add description, website, topics

3. **Share the Link**
   - https://github.com/Saransh27/interceptly
   - Share with others

4. **Continue Development**
   - Make changes in `src/`
   - Commit and push with `git add . && git commit -m "..." && git push`

---

## 🆘 Troubleshooting

### Issue: "fatal: not a git repository"
**Solution**: Make sure you're in the right directory
```bash
cd c:\Interceptly
git init
```

### Issue: "Permission denied" or "Authentication failed"
**Solution**: Use Personal Access Token, not password
- Create token at https://github.com/settings/tokens
- Use token as the password when prompted

### Issue: "fatal: remote origin already exists"
**Solution**: Remove old remote first
```bash
git remote remove origin
git remote add origin https://github.com/Saransh27/interceptly.git
```

### Issue: Can't find GitHub URL
**Solution**: 
1. Go to https://github.com/Saransh27
2. Click **+** → **New repository**
3. Create repo named `interceptly`
4. Copy the HTTPS URL from green "Code" button

---

## 📚 Commands Reference

```bash
# Navigate to project
cd c:\Interceptly

# Configure git (one-time)
git config --global user.name "Saransh27"
git config --global user.email "email@example.com"

# Check current config
git config --global user.name

# Initialize git
git init

# Check status
git status

# Add files
git add .

# Commit
git commit -m "message"

# Add remote
git remote add origin URL

# Check remote
git remote -v

# Rename branch
git branch -M main

# Push
git push -u origin main

# Subsequent pushes
git push

# View history
git log --oneline
```

---

## ✨ That's It!

Your Interceptly project will be pushed to **github.com/Saransh27/interceptly** 🎉

**Do this now:**

1. ✅ Create repo on Saransh27 account
2. ✅ Copy the HTTPS URL
3. ✅ Create Personal Access Token
4. ✅ Run the commands above
5. ✅ Visit your GitHub repo to verify

---

**Good luck! 🚀**

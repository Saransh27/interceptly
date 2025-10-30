# 🔑 Push with Personal Access Token

The cached credentials from ImSaranshMehra are persisting. You need to use a Personal Access Token.

## Steps:

1. **Go to GitHub and create a token:**
   - Login as Saransh27: https://github.com/Saransh27
   - Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Name: `Interceptly`
   - Scope: Select **`repo`** ✓
   - Expiration: 90 days
   - Click "Generate token"
   - **COPY the token** (it looks like: `ghp_xxxxxxxxxxxxx`)

2. **Use the token in the URL:**
   ```bash
   cd c:\Interceptly
   git remote remove origin
   git remote add origin https://Saransh27:YOUR_TOKEN@github.com/Saransh27/interceptly.git
   ```
   Replace `YOUR_TOKEN` with your actual token from step 1

3. **Push:**
   ```bash
   git push -u origin main
   ```

**Example:**
```bash
git remote add origin https://Saransh27:ghp_1234567890abcdefg@github.com/Saransh27/interceptly.git
git push -u origin main
```

---

## Alternative: Use Git Credential Storage

```bash
cd c:\Interceptly
git credential reject https://github.com
git config --global credential.useHttpPath true
git push -u origin main
```

When prompted, enter:
- Username: `Saransh27`
- Password: Your Personal Access Token

---

Get your token from GitHub and paste it in! 🚀

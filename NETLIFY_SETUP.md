# 🔐 Secure Brevo Email Integration via Netlify

This project uses Netlify serverless functions to securely send approval emails via Brevo API.

## 📁 Project Structure

```
course selection/
├── netlify/
│   └── functions/
│       └── send-approval-email.js    # Serverless email function
├── netlify.toml                       # Netlify configuration
├── dashborad/
│   ├── sheets-integration.js          # Calls Netlify function
│   └── app.js                         # Dashboard logic
└── index.html                         # Main website
```

## 🚀 Deployment Steps

### 1. **Push to GitHub**

```bash
git add .
git commit -m "Add Netlify serverless email function"
git push origin main
```

### 2. **Deploy to Netlify**

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize
4. Choose your repository: `indexwebtest2`
5. Configure build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `.` (dot)
   - **Functions directory:** `netlify/functions`
6. Click **"Deploy site"**

### 3. **Add Brevo API Key (Environment Variable)**

⚠️ **IMPORTANT:** Never commit API keys to Git!

1. In Netlify dashboard, go to: **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   - **Key:** `BREVO_API_KEY`
   - **Value:** Your Brevo API key (e.g., `xkeysib-xxxxx...`)
   - **Scopes:** All (Production, Deploy previews, Branch deploys)
4. Click **"Save"**

### 4. **Get Your Brevo API Key**

1. Go to [Brevo](https://app.brevo.com)
2. Navigate to: **SMTP & API** → **API Keys**
3. Click **"Create a new API key"**
4. Name it: `Netlify Ignite Dashboard`
5. Copy the generated key (format: `xkeysib-xxxxxxxxx...`)

### 5. **Verify Sender Email in Brevo**

1. In Brevo, go to: **Senders & IP** → **Senders**
2. Add and verify: `support@soulix.tech`
3. Follow email verification steps

### 6. **Test the Function**

After deployment:
1. Go to your Netlify site URL
2. Navigate to dashboard (click Pranav Navghare 5 times)
3. Login with credentials
4. Approve a test application
5. Check if email is sent successfully

## 🔧 How It Works

### **Flow:**

```
Dashboard (Approve Button) 
    ↓
sheets-integration.js 
    ↓
Netlify Function (/.netlify/functions/send-approval-email)
    ↓
Brevo API (sends email)
    ↓
Student receives email ✅
```

### **Security Benefits:**

✅ API key stored securely in Netlify environment (not in code)  
✅ No exposure in frontend JavaScript  
✅ CORS enabled for your domain  
✅ Rate limiting handled by Netlify  
✅ Automatic HTTPS encryption  

## 📧 Email Template

The approval email includes:
- SOULIX logo
- Student name
- Course name
- Transaction ID
- Welcome message
- Professional branding

## 🛠️ Testing Locally

To test Netlify functions locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Run local dev server
netlify dev
```

This will run your site at `http://localhost:8888` with working serverless functions.

## 🔄 Updating the Function

After making changes to `send-approval-email.js`:

```bash
git add netlify/functions/send-approval-email.js
git commit -m "Update email function"
git push origin main
```

Netlify will automatically redeploy.

## 📊 Monitoring

- **Function logs:** Netlify dashboard → Functions → View logs
- **Email stats:** Brevo dashboard → Statistics

## ⚠️ Troubleshooting

**Email not sending?**
1. Check Netlify function logs
2. Verify `BREVO_API_KEY` environment variable is set
3. Confirm sender email is verified in Brevo
4. Check Brevo API quota/limits

**Function not found?**
1. Verify `netlify.toml` is in root directory
2. Check functions folder path: `netlify/functions/`
3. Redeploy site on Netlify

## 🔐 Security Notes

- Never commit `.env` files or API keys
- Use Netlify environment variables for sensitive data
- For production, consider adding authentication to the function
- Monitor function usage in Netlify dashboard

## 📞 Support

For issues contact: **support@soulix.tech**

---

Made with 🔥 by Team SOULIX

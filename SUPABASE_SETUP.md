# 🚀 Supabase Integration Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign In"**
3. Create a new project:
   - **Name**: `ignite-course-selection`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your location
   - Click **"Create new project"**

## Step 2: Create Database Tables

Go to **SQL Editor** in Supabase and run these SQL commands:

### 1. Applications Table
```sql
-- Create applications table
CREATE TABLE applications (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    course TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    applied_date TIMESTAMPTZ NOT NULL,
    approved_date TIMESTAMPTZ,
    rejected_date TIMESTAMPTZ,
    payment_type TEXT,
    payment_amount TEXT,
    payment_status TEXT,
    upi_transaction_id TEXT,
    installments_paid INTEGER DEFAULT 0,
    total_installments INTEGER DEFAULT 0,
    rejection_reason TEXT,
    approved_by JSONB,
    rejected_by JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_date ON applications(applied_date DESC);
CREATE INDEX idx_applications_email ON applications(email);

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Allow all access" ON applications FOR ALL USING (true);
```

### 2. Admin Logs Table
```sql
-- Create admin_logs table
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    username TEXT NOT NULL,
    device_type TEXT,
    browser TEXT,
    platform TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_admin_logs_timestamp ON admin_logs(timestamp DESC);
CREATE INDEX idx_admin_logs_type ON admin_logs(log_type);

-- Enable RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all access" ON admin_logs FOR ALL USING (true);
```

### 3. Login Sessions Table
```sql
-- Create login_sessions table
CREATE TABLE login_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    login_time TIMESTAMPTZ NOT NULL,
    device_type TEXT,
    browser TEXT,
    platform TEXT,
    screen_resolution TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_login_sessions_time ON login_sessions(login_time DESC);
CREATE INDEX idx_login_sessions_username ON login_sessions(username);

-- Enable RLS
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all access" ON login_sessions FOR ALL USING (true);
```

### 4. Enable Real-time (IMPORTANT!)
```sql
-- Enable real-time for applications table
ALTER PUBLICATION supabase_realtime ADD TABLE applications;

-- Enable real-time for admin_logs table
ALTER PUBLICATION supabase_realtime ADD TABLE admin_logs;

-- Enable real-time for login_sessions table
ALTER PUBLICATION supabase_realtime ADD TABLE login_sessions;
```

## Step 3: Get API Keys

1. Go to **Settings** → **API** in Supabase
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon (public) key**: `eyJhbGci...` (long key)

## Step 4: Update Your Code

1. Open `dashborad/supabase-config.js`
2. Replace these lines:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // ← Paste your Project URL here
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // ← Paste your Anon key here
   ```

3. Add Supabase CDN to your HTML files (already added to index.html):
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ```

## Step 5: Test Connection

1. Open your dashboard
2. Check browser console for:
   - ✅ Supabase initialized successfully
   - 🔴 Real-time subscription active
   - ✅ Synced X applications from Supabase

## Step 6: Migrate Existing Data (Optional)

If you have existing localStorage data:

1. Open browser console
2. Run: `localStorage.getItem('soulixApplications')`
3. Copy the JSON data
4. Go to Supabase → Table Editor → applications
5. Click **"Insert row"** and paste data (or use bulk import)

## Features Enabled

✅ **Real-time Sync**: All devices update instantly when data changes
✅ **Persistent Logs**: Never lose admin activity logs
✅ **Login Tracking**: Track who logged in from where and when
✅ **Cross-Device**: Works across mobile, tablet, desktop simultaneously
✅ **Offline Support**: Falls back to localStorage if Supabase unavailable
✅ **Audit Trail**: Complete history of all approvals/rejections

## Security Notes

- The current setup allows all access (for testing)
- In production, add proper RLS policies to restrict access
- Consider adding authentication for better security
- Never commit API keys to public repositories (use environment variables)

## Troubleshooting

**Error: "Supabase client not loaded"**
- Make sure Supabase CDN script is loaded in HTML

**Error: "relation does not exist"**
- Run all SQL commands in Step 2 to create tables

**No real-time updates**
- Check if real-time is enabled (Step 2, section 4)
- Verify subscription in browser console

**CORS errors**
- Add your Netlify domain to Supabase CORS settings
- Go to Settings → API → CORS

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Real-time Guide: https://supabase.com/docs/guides/realtime

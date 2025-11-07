# 📊 Rate Limits & Quotas

## 🔥 Netlify Function Limits

### **Free Tier (Starter Plan)**
- ✅ **125,000 function requests/month**
- ✅ **100 hours runtime/month**
- ✅ **Function timeout:** 10 seconds
- ✅ **Function size:** 50MB
- ✅ **Background functions:** Not available

### **Pro Plan ($19/month)**
- ✅ **2 million function requests/month**
- ✅ **Unlimited runtime hours**
- ✅ **Function timeout:** 26 seconds
- ✅ **Background functions:** Available

### **Our Custom Rate Limiting**
To protect your function and prevent abuse:

```
⏱️ Time Window: 1 minute
📧 Max Emails: 10 per IP per minute
🔄 Auto Reset: After 1 minute
```

**Rate Limit Headers Returned:**
- `X-RateLimit-Limit: 10`
- `X-RateLimit-Remaining: 7`
- `Retry-After: 45` (seconds, when rate limited)

**HTTP Status Codes:**
- `200` - Email sent successfully
- `429` - Too many requests (rate limited)
- `400` - Bad request (missing fields)
- `500` - Server error

---

## 📧 Brevo (Sendinblue) Limits

### **Free Plan**
- ✅ **300 emails/day**
- ✅ Unlimited contacts
- ✅ Email campaigns
- ❌ No daily sending limit removal

### **Lite Plan ($25/month)**
- ✅ **20,000 emails/month**
- ✅ No daily limit
- ✅ Email support
- ✅ Advanced statistics

### **Business Plan ($65/month)**
- ✅ **100,000 emails/month**
- ✅ Priority sending
- ✅ Phone support
- ✅ Landing pages

### **Enterprise**
- ✅ Custom volume
- ✅ Dedicated IP
- ✅ Priority support

---

## 🧮 Estimated Usage (IGNITE Program)

### **Scenario: 100 Students/Month**

#### Netlify Function Calls
```
100 approvals × 1 email each = 100 function calls/month
✅ Well within free tier (125,000/month)
```

#### Brevo Emails
```
100 approval emails = 100 emails/month
✅ Within free tier (300/day = 9,000/month)
```

### **Scenario: 1,000 Students/Month**

#### Netlify Function Calls
```
1,000 approvals × 1 email = 1,000 calls/month
✅ Still within free tier (125,000/month)
```

#### Brevo Emails
```
1,000 emails/month
✅ Requires Lite Plan ($25/month for 20,000/month)
```

---

## ⚠️ Rate Limit Triggers

### **When Rate Limit Kicks In:**
```
Scenario: Admin approves 11 students in 1 minute
Result: 
  - First 10 emails: ✅ Sent successfully
  - 11th email: ❌ Rate limited (429 error)
  - Wait 1 minute: ✅ Can send again
```

### **Why Rate Limiting?**
1. **Prevent abuse** - Stops spam or accidental loops
2. **Protect Brevo quota** - Avoids burning through email limit
3. **Cost control** - Prevents unexpected Netlify overage charges
4. **API protection** - Prevents hitting Brevo's API rate limits

---

## 🛡️ Multi-Layer Protection

### **Layer 1: Our Function Rate Limit**
```
10 emails per IP per minute
```

### **Layer 2: Netlify Built-in Limits**
```
Free: 125K requests/month
Pro: 2M requests/month
```

### **Layer 3: Brevo API Rate Limits**
```
300 API calls/minute (Enterprise)
Lower for free/lite plans
```

### **Layer 4: Brevo Email Quotas**
```
Free: 300 emails/day
Lite: 20,000 emails/month
```

---

## 📈 Monitoring & Alerts

### **Check Usage:**

**Netlify Dashboard:**
- Functions → Analytics
- See: Total invocations, errors, runtime

**Brevo Dashboard:**
- Statistics → Email activity
- See: Sent, delivered, bounce rate

### **Set Up Alerts:**

**Netlify:**
- Settings → Notifications
- Alert when approaching limits

**Brevo:**
- Account → Notifications
- Alert at 80% quota usage

---

## 🚀 Scaling Recommendations

### **< 100 students/month**
✅ **Free tier everything**
- Netlify Free
- Brevo Free (300/day)
- **Cost: $0/month**

### **100-500 students/month**
✅ **Upgrade Brevo only**
- Netlify Free (125K requests)
- Brevo Lite ($25/month for 20K emails)
- **Cost: $25/month**

### **500-2000 students/month**
✅ **Consider Pro Plans**
- Netlify Pro ($19/month for 2M requests)
- Brevo Business ($65/month for 100K emails)
- **Cost: $84/month**

### **2000+ students/month**
✅ **Enterprise Solutions**
- Contact Netlify for custom pricing
- Brevo Enterprise plan
- Consider dedicated email server

---

## 🔧 Adjusting Rate Limits

To change the rate limit in your function:

**Edit:** `netlify/functions/send-approval-email.js`

```javascript
const RATE_LIMIT = {
  windowMs: 60000,    // 1 minute (60000ms)
  maxRequests: 10     // Change this number
};
```

**Examples:**
```javascript
// More restrictive (5 emails/minute)
maxRequests: 5

// More lenient (20 emails/minute)
maxRequests: 20

// Longer window (5 minutes)
windowMs: 300000,
maxRequests: 50
```

---

## ⚡ Performance Tips

1. **Batch Approvals Carefully**
   - Don't approve 50 students at once
   - Stagger approvals across minutes

2. **Monitor Dashboard**
   - Check Netlify function logs
   - Watch Brevo statistics

3. **Plan for Growth**
   - Upgrade before hitting limits
   - Set up alerts at 80% usage

4. **Test Rate Limits**
   - Use `test-email.html` to verify
   - Send 11 emails quickly to test 429 response

---

## 📞 When to Upgrade

### **Upgrade Brevo When:**
- ❌ Hitting 300 emails/day frequently
- ❌ Need to send > 9,000 emails/month
- ❌ Need priority sending
- ❌ Want better analytics

### **Upgrade Netlify When:**
- ❌ Approaching 125K function calls/month
- ❌ Need longer timeout (>10 seconds)
- ❌ Want background functions
- ❌ Need higher bandwidth

---

## 🎯 Current Setup Summary

```
✅ Custom Rate Limit: 10 emails/min per IP
✅ Netlify Free Tier: 125,000 calls/month
✅ Brevo Free Tier: 300 emails/day
✅ Function Timeout: 10 seconds
✅ Cost: $0/month (for small scale)
```

**This is perfect for:**
- Testing and development
- Small programs (< 100 students/month)
- MVP launches
- Proof of concept

**Ready to scale when you grow! 🚀**

---

Last Updated: November 7, 2025

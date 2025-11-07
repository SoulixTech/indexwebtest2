# ✅ Netlify Deployment Checklist

## Pre-Deployment
- [ ] Brevo account created
- [ ] Brevo API key generated
- [ ] Sender email verified in Brevo (support@soulix.tech)
- [ ] Code pushed to GitHub

## Netlify Setup
- [ ] Site connected to GitHub repo
- [ ] Environment variable `BREVO_API_KEY` added
- [ ] Site deployed successfully
- [ ] Custom domain configured (optional)

## Testing
- [ ] Secret access works (click Pranav Navghare 5x)
- [ ] Dashboard login works
- [ ] Google Sheets syncing
- [ ] Approve button sends email
- [ ] Email received in inbox (check spam)
- [ ] Rate limiting works (try 11 emails quickly, 11th should fail with 429)

## Monitoring
- [ ] Check Netlify function logs
- [ ] Monitor Brevo email statistics
- [ ] Watch for rate limit 429 errors
- [ ] Set up usage alerts in both dashboards

## 📊 Current Limits
- **Custom Rate Limit:** 10 emails per minute per IP
- **Netlify Free:** 125,000 function calls/month
- **Brevo Free:** 300 emails/day (9,000/month)
- **Function Timeout:** 10 seconds

See `LIMITS_AND_QUOTAS.md` for detailed information.

## Production Ready
- [ ] Test with real student data
- [ ] Monitor Netlify function logs
- [ ] Check Brevo email statistics
- [ ] Share dashboard access with team

## 🔗 Important Links
- Netlify Dashboard: https://app.netlify.com
- Brevo Dashboard: https://app.brevo.com
- GitHub Repo: https://github.com/SoulixTech/indexwebtest2

## 🔑 Credentials to Remember
- Dashboard Username: `admin`
- Dashboard Password: `soulix2025`
- Brevo API Key: (stored in Netlify environment)

## 📧 Email Configuration
- Sender: Team SOULIX <support@soulix.tech>
- Subject: ✅ Seat Confirmed — IGNITE Training Program
- Logo: https://lh3.googleusercontent.com/d/1QP4RpN3F1pc9lIN7lNRgCFYQIU-3skGH

---
Last Updated: November 7, 2025

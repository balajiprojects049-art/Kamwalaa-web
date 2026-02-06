# 🚀 KAMWALAA - DEPLOYMENT GUIDE

**Quick reference for deploying the Kamwalaa platform to production**

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

- [x] Backend deployed to Railway ✅
- [x] Database on Supabase ✅
- [x] All features tested locally ✅
- [x] Reviews & ratings working ✅
- [x] WhatsApp integration configured ✅
- [ ] Environment variables ready
- [ ] Production domain registered (optional)

---

## 🎯 **DEPLOYMENT OPTIONS**

### **Option 1: Vercel (Recommended)** ⭐
- Free tier available
- Automatic builds from Git
- Built-in CI/CD
- Custom domain support
- Excellent performance

### **Option 2: Netlify**
- Similar to Vercel
- Easy setup
- Free tier available

### **Option 3: Railway**
- Same platform as backend
- Unified billing
- Simple deployment

---

## 🚀 **VERCEL DEPLOYMENT** (Step-by-Step)

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Navigate to Frontend Directory**

```bash
cd "c:\Users\hp\OneDrive\Desktop\new clients\Kamwalaa\kamwalaa-web"
```

### **Step 3: Build Locally (Optional Test)**

```bash
npm run build
```

**Expected Output:**
- No errors
- `dist` folder created
- Build completes successfully

### **Step 4: Login to Vercel**

```bash
vercel login
```

**Choose:** Email or GitHub login

### **Step 5: Deploy**

```bash
vercel --prod
```

**Follow Prompts:**
1. Set up and deploy? **Y**
2. Which scope? **Select your account**
3. Link to existing project? **N**
4. Project name? **kamwalaa-web** (or custom name)
5. Directory? **./** (current directory)
6. Want to override settings? **N**

**Wait for:**
- Building
- Uploading
- Deployment complete

**You'll receive:**
- Production URL (e.g., `https://kamwalaa-web.vercel.app`)

### **Step 6: Configure Environment Variables**

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
VITE_API_URL=https://kamwalaa-web-production.up.railway.app/api/v1
```

**Then redeploy:**
```bash
vercel --prod
```

---

## 🔧 **ENVIRONMENT VARIABLES**

### **Frontend (.env.production)**

Create this file in `kamwalaa-web/`:

```env
VITE_API_URL=https://kamwalaa-web-production.up.railway.app/api/v1
```

### **Backend (Already Set on Railway)**

No changes needed - already configured:
- `DATABASE_URL`
- `JWT_SECRET`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

---

## 🧪 **POST-DEPLOYMENT TESTING**

### **1. Test Homepage**
```
https://your-vercel-url.vercel.app
```
- [ ] Loads correctly
- [ ] No console errors
- [ ] Services display

### **2. Test Booking Flow**
- [ ] Select a service
- [ ] Complete booking
- [ ] WhatsApp notification received
- [ ] Booking appears in My Bookings

### **3. Test Reviews**
- [ ] Mark booking as completed (admin panel)
- [ ] Submit a review
- [ ] Verify review saved

### **4. Test Admin Panel**
```
https://your-vercel-url.vercel.app/admin/login
```
- [ ] Login works
- [ ] Dashboard loads
- [ ] Analytics display
- [ ] Bookings management works

---

## 🌐 **CUSTOM DOMAIN** (Optional)

### **Add Custom Domain on Vercel:**

1. Go to Project Settings → Domains
2. Add your domain (e.g., `kamwalaa.com`)
3. Configure DNS:

**For Root Domain (kamwalaa.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW (www.kamwalaa.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (5-30 minutes)
5. SSL certificate auto-generated

---

## 📱 **WHATSAPP CONFIGURATION**

### **Keep Backend Running:**

The WhatsApp integration requires the backend to be running continuously.

**Railway Advantage:**
- Backend runs 24/7
- Auto-restarts on crash
- Persistent session

**Important:**
- Scan QR code once on first deployment
- Session persists in backend
- WhatsApp stays connected

### **Test WhatsApp:**

After deployment:
1. Create a test booking
2. Check if WhatsApp message received
3. Verify message format

**Message Format:**
```
🔔 NEW BOOKING ALERT

Booking #: BK-123456
Customer: John Doe
Phone: +91-9876543210
Service: AC Repair
Date: Feb 5, 2026
Time: 10:00 AM
Address: 123 Main St, Hyderabad - 500072

Please confirm & assign partner.
```

---

## 🔒 **SECURITY CHECKLIST**

### **Before Going Live:**

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Admin password changed from default
- [ ] CORS configured for production URL
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables not in code
- [ ] .env files in .gitignore
- [ ] API rate limiting enabled
- [ ] Input validation on all forms

---

## 📊 **MONITORING & ANALYTICS**

### **Set Up Google Analytics (Optional):**

1. Create GA4 property
2. Get Measurement ID
3. Add to `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### **Vercel Analytics:**

Automatically enabled - view in Vercel Dashboard

---

## 🐛 **TROUBLESHOOTING**

### **Build Fails:**

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### **API Calls Fail:**

Check:
1. `VITE_API_URL` environment variable set correctly
2. Railway backend is running
3. CORS enabled for vercel domain
4. Network tab in browser DevTools

### **WhatsApp Not Sending:**

Check:
1. Backend logs on Railway
2. WhatsApp session status
3. Phone number format
4. Message template

---

## 🔄 **CI/CD SETUP** (Automatic Deployments)

### **Connect GitHub:**

1. Push code to GitHub repository
2. Go to Vercel Dashboard
3. Import Project from GitHub
4. Select repository
5. Configure build settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables
7. Deploy!

**From now on:**
- Push to `main` → Auto-deploy to production
- Pull requests → Preview deployments

---

## 📈 **SCALABILITY CONSIDERATIONS**

### **Current Setup:**
- ✅ Backend on Railway (auto-scales)
- ✅ Frontend on Vercel (CDN)
- ✅ Database on Supabase (managed)

### **Future Optimizations:**
- [ ] Add Redis for caching
- [ ] Enable database connection pooling
- [ ] Implement CDN for images
- [ ] Add background jobs queue
- [ ] Set up monitoring (Sentry, LogRocket)

---

## 🎉 **LAUNCH DAY CHECKLIST**

### **Morning:**
- [ ] Deploy to production
- [ ] Run full test suite
- [ ] Verify WhatsApp working
- [ ] Check all admin functions
- [ ] Test booking flow end-to-end

### **Afternoon:**
- [ ] Announce on social media
- [ ] Send email to early users
- [ ] Monitor error logs
- [ ] Watch analytics

### **Evening:**
- [ ] Process any bookings
- [ ] Respond to customer queries
- [ ] Fix any urgent bugs
- [ ] Celebrate! 🎊

---

## 📞 **SUPPORT & MAINTENANCE**

### **Daily Tasks:**
- Check admin dashboard for new bookings
- Respond to customer inquiries
- Monitor WhatsApp notifications

### **Weekly Tasks:**
- Review analytics data
- Check for errors in logs
- Update service offerings
- Backup database

### **Monthly Tasks:**
- Performance audit
- Security updates
- Feature improvements
- User feedback review

---

## 🔗 **IMPORTANT URLS**

### **Production:**
- **Frontend:** https://[your-vercel-url].vercel.app
- **Backend:** https://kamwalaa-web-production.up.railway.app/api/v1
- **Admin:** https://[your-vercel-url].vercel.app/admin/login

### **Dashboards:**
- **Vercel:** https://vercel.com/dashboard
- **Railway:** https://railway.app/dashboard
- **Supabase:** https://supabase.com/dashboard

---

## 🆘 **EMERGENCY CONTACTS**

### **Services:**
- **Vercel Support:** support@vercel.com
- **Railway Support:** team@railway.app
- **Supabase Support:** support@supabase.io

### **Documentation:**
- **Vite:** https://vitejs.dev/guide/
- **React:** https://react.dev/
- **Vercel:** https://vercel.com/docs

---

## ✅ **DEPLOYMENT COMPLETE!**

**Your Kamwalaa platform is now live!** 🚀

**Next Steps:**
1. Share the URL with stakeholders
2. Start onboarding service partners
3. Process customer bookings
4. Gather feedback
5. Iterate and improve

---

**🎊 Congratulations on launching Kamwalaa!**

**Need help?** Refer to:
- `COMPLETION_REPORT.md` - Feature documentation
- `TESTING_CHECKLIST.md` - Full test suite
- `README.md` - Project overview

---

**Last Updated:** February 4, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅

# 📱 MSG91 SMS OTP Setup Guide

## ✅ **Why MSG91?**

✅ **6x Cheaper** than Twilio (₹0.12 vs ₹0.70 per SMS)  
✅ **Made for India** - Better delivery rates  
✅ **No Verification** - Send to any Indian number immediately  
✅ **Easy Setup** - Just 2 credentials needed  
✅ **Free Trial** - ₹10 credit (~50-80 SMS free)  

---

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Create MSG91 Account**

1. Go to [https://msg91.com](https://msg91.com)
2. Click **"Sign Up Free"**
3. Fill in your details:
   - Name
   - Email
   - Phone number
   - Company name (can be anything)
4. Verify your email
5. **You'll get ₹10 free credit!**

---

### **Step 2: Get Your Auth Key**

1. After login, go to **Dashboard**
2. Click on **"API"** in the left sidebar
3. You'll see **"Authkey"** - Copy it!

```
Example: 123456ABCDefgh7890XYZ
```

---

### **Step 3: Create OTP Template (Optional but Recommended)**

MSG91 requires DLT-approved templates for commercial use. For testing, you can skip this.

**For Production:**
1. Go to **"Templates"** → **"Add Template"**
2. Choose **"OTP"** template type
3. Template message:
   ```
   Your Kamwalaa verification code is ##OTP##. Valid for 10 minutes.
   ```
4. Submit for approval (takes 1-2 hours)
5. Copy the **Template ID** when approved

**For Testing:**
- You can use default template or skip template ID
- MSG91 will still send OTP

---

### **Step 4: Configure Backend**

Update your `kamwalaa-backend/.env` file:

```env
# MSG91 SMS Configuration
MSG91_AUTH_KEY=your_auth_key_here
MSG91_TEMPLATE_ID=your_template_id_here
```

**Example:**
```env
MSG91_AUTH_KEY=123456ABCDefgh7890XYZ
MSG91_TEMPLATE_ID=65f8a1b2c3d4e5f6789012
```

**Note:** If you don't have a template yet, leave `MSG91_TEMPLATE_ID` empty or use `default`.

---

### **Step 5: Restart Backend**

```bash
# Backend will auto-restart if nodemon is running
# Or manually restart:
npm run dev
```

---

## 🧪 **Test Real SMS**

1. **Open Login Page**: `http://localhost:5173/login`
2. **Enter Indian mobile number**: `9876543210`
3. **Enter your name**
4. **Click "Get OTP"**
5. **Check your phone** - You'll receive SMS! 📱

---

## 💰 **Pricing Breakdown**

| Provider | Per SMS Cost | Free Trial | Verif Needed |
|----------|-------------|------------|--------------|
| **MSG91** | **₹0.12-0.20** | ₹10 credit | ❌ No |
| Twilio | ₹0.70-1.00 | $15 credit | ✅ Yes |
| Fast2SMS | ₹0.10-0.15 | 50 SMS | ❌ No |

**MSG91 is 6x cheaper than Twilio!**

---

## 📊 **How It Works**

### **Without MSG91 (Development Mode):**
```
User enters phone → OTP generated → Saved to DB 
→ Logged to console → Shown in modal popup
```

### **With MSG91 (Production Mode):**
```
User enters phone → OTP generated → Saved to DB 
→ Real SMS sent via MSG91 → User receives OTP on phone
```

**Console Output:**
```bash
# Without MSG91:
🔐 OTP for 9876543210: 123456 (MSG91 not configured)

# With MSG91:
✅ SMS sent to +919876543210 via MSG91
```

---

## 🎯 **SMS Message Format**

When OTP is sent, user receives:

```
Your Kamwalaa verification code is: 123456
Valid for 10 minutes.

- Kamwalaa
```

You can customize this in `authController.js`.

---

## 🔧 **Advanced Configuration**

### **Custom SMS Template**

Edit `authController.js` to customize the message:

```javascript
const response = await axios.post(msg91Url, {
    template_id: process.env.MSG91_TEMPLATE_ID,
    mobile: `91${phone}`,
    authkey: process.env.MSG91_AUTH_KEY,
    otp: otp,
    otp_expiry: 10,
    // Add custom variables
    var1: 'Kamwalaa',  // Company name
    var2: '10'          // Validity in minutes
});
```

---

## 🌍 **Different Country Codes**

**Current (India):**
```javascript
mobile: `91${phone}`  // +91 for India
```

**For other countries:**
```javascript
// USA/Canada
mobile: `1${phone}`

// UK
mobile: `44${phone}`

// Make it dynamic
mobile: `${countryCode}${phone}`
```

---

## 🐛 **Troubleshooting**

### **1. SMS Not Received?**

**Check MSG91 Dashboard:**
- Go to **"Reports"** → **"SMS Logs"**
- See if SMS was sent successfully
- Check delivery status

**Common Issues:**
- ❌ Wrong Auth Key → Check `.env` file
- ❌ Insufficient balance → Recharge in dashboard
- ❌ Invalid phone format → Should be 10 digits
- ❌ DND number → User has DND service active

### **2. Error: "Invalid Auth Key"**

```bash
MSG91 SMS Error: Authentication failed
```

**Solution:**
- Copy Auth Key again from MSG91 dashboard
- Make sure no extra spaces in `.env` file
- Restart backend server

### **3. Error: "Template not found"**

```bash
MSG91 SMS Error: Template ID not valid
```

**Solution:**
- Use empty string or `default` for `MSG91_TEMPLATE_ID`
- Or create and approve template in MSG91

### **4. Still showing modal with OTP?**

This is normal! The modal shows OTP in development mode:
- For testing purposes
- In production (when `MSG91_AUTH_KEY` is set), modal won't show OTP
- User will only receive SMS

---

## 💳 **Recharge & Pricing**

### **Free Trial:**
- ₹10 credit (50-80 SMS)
- Valid for 30 days

### **Paid Plans:**
1. **Pay as you go:**
   - ₹100 → ~833 SMS (₹0.12 per SMS)
   - ₹500 → ~4166 SMS
   - ₹1000 → ~8333 SMS

2. **Route Options:**
   - **Promotional**: ₹0.12/SMS (for OTP, notifications)
   - **Transactional**: ₹0.20/SMS (higher priority)

**Recommended:** Start with ₹100 recharge (833 SMS)

---

## 🔒 **Security Best Practices**

1. **Never commit `.env`** - Already in `.gitignore`
2. **Rotate Auth Key** if exposed
3. **Set rate limits** - Prevent abuse
4. **Monitor usage** - Check MSG91 dashboard
5. **Validate phone numbers** - Before sending OTP

---

## 📈 **Production Checklist**

Before going live:

- [ ] Create and approve DLT template
- [ ] Add template ID to `.env`
- [ ] Recharge MSG91 account
- [ ] Test on multiple numbers
- [ ] Set up usage alerts in MSG91
- [ ] Remove OTP from API response
- [ ] Add rate limiting (max 3 OTPs per 10 mins)
- [ ] Monitor delivery rates

---

## 🎓 **Additional Features**

MSG91 also supports:
- ✅ **Voice OTP** - Call instead of SMS
- ✅ **Email OTP** - Backup method
- ✅ **WhatsApp OTP** - Via WhatsApp Business
- ✅ **Analytics** - Delivery reports, success rates
- ✅ **Webhooks** - Get delivery status

---

## 🆚 **MSG91 vs Twilio Comparison**

| Feature | MSG91 | Twilio |
|---------|-------|--------|
| **SMS Cost (India)** | ₹0.12 | ₹0.70 |
| **Setup Time** | 5 mins | 15 mins |
| **Free Trial** | ₹10 | $15 |
| **Verif Required** | No | Yes (trial) |
| **India Delivery** | Excellent | Good |
| **Global Reach** | Limited | Worldwide |
| **API Ease** | Very Easy | Easy |
| **Support** | India hours | 24/7 |

---

## 📞 **MSG91 Support**

- **Email**: support@msg91.com
- **Phone**: +91-9560039595
- **Chat**: Live chat on dashboard
- **Docs**: [https://docs.msg91.com](https://docs.msg91.com)

---

## ✅ **You're All Set!**

Your Kamwalaa app now has:
- ✅ Real SMS OTP delivery
- ✅ 6x cheaper than Twilio
- ✅ No phone verification needed
- ✅ Better delivery for India
- ✅ Free trial to test

**Just add your MSG91 Auth Key and you're ready to send real OTPs!** 🚀

---

## 🎯 **Quick Start Checklist**

1. [ ] Sign up at https://msg91.com
2. [ ] Copy Auth Key from dashboard
3. [ ] Update `.env` with `MSG91_AUTH_KEY`
4. [ ] Restart backend server
5. [ ] Test on login page
6. [ ] Receive OTP on your phone! 📱

**Total time: 5 minutes** ⏱️

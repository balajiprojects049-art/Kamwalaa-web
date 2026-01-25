# 📱 Real OTP SMS Integration Guide

## ✅ Status: Twilio Package Installed & Code Ready

The backend is now configured to send **real SMS OTPs** to mobile numbers!

---

## 🚀 **How to Enable Real SMS**

### **Step 1: Get Twilio Credentials (Free)**

1. **Sign Up**: Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. **Verify Your Email**: Check your email and verify
3. **Get Phone Number**: Twilio will assign you a free trial phone number
4. **Find Credentials**: On the Twilio Console Dashboard, copy these 3 values:

```
Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Auth Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Phone Number: +1234567890 (Your Twilio number)
```

---

### **Step 2: Configure Backend Environment**

Update your `.env` file in `kamwalaa-backend/.env`:

```env
NODE_ENV=development
PORT=5000

# Database (already configured)
DATABASE_URL=postgresql://postgres.tqvlborrpiecddfiikvz:Kamwala%409030@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this

# ⭐ ADD THESE THREE LINES (replace with your Twilio values)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

### **Step 3: Add Indian Number to Twilio Verified List (Trial Account)**

⚠️ **Important for Trial Accounts:**

Twilio trial accounts can only send SMS to **verified phone numbers**.

1. Go to Twilio Console → **Phone Numbers** → **Verified Caller IDs**
2. Click **"Add a new number"**
3. Enter your Indian mobile number (e.g., `+919876543210`)
4. Twilio will call/SMS you with a verification code
5. Enter the code to verify

**Or** upgrade to a paid account to send to any number.

---

### **Step 4: Restart Backend Server**

After updating `.env`:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 **How It Works**

### **Development Mode (No Twilio)**
When Twilio credentials are **NOT** configured:
- ✅ OTP is generated
- ✅ Saved to database
- ✅ Logged to console
- ✅ Returned in API response (for testing)
- ❌ No SMS sent

**Console Output:**
```
🔐 OTP for 9876543210: 123456 (Twilio not configured)
```

### **Production Mode (Twilio Configured)**
When Twilio credentials **ARE** configured:
- ✅ OTP is generated
- ✅ Saved to database
- ✅ **Real SMS sent to mobile number**
- ✅ Logged to console
- ❌ OTP NOT returned in API response (security)

**Console Output:**
```
✅ SMS sent to +919876543210
```

**SMS Message:**
```
Your Kamwalaa verification code is: 123456. Valid for 10 minutes.
```

---

## 📝 **Test Real SMS**

1. **Update `.env`** with your Twilio credentials
2. **Restart backend** server
3. **Go to Login page**: `http://localhost:5173/login`
4. **Enter your verified phone number**: `9876543210`
5. **Click "Get OTP"**
6. **Check your phone** - You'll receive the SMS! 📱

---

## 💰 **Twilio Pricing**

### **Free Trial:**
- **$15 credit** (approx **500 SMS** for India)
- Can only send to **verified numbers**
- Perfect for testing

### **Paid Plan:**
- **₹0.50 - ₹1.50 per SMS** to India
- Send to **any number**
- No verification needed
- Pay-as-you-go (no monthly fees)

---

## 🔒 **Security Notes**

1. **Never commit `.env` file** to Git (already in `.gitignore`)
2. **Rotate credentials** if accidentally exposed
3. **Use environment variables** on production server
4. **OTP expires** after 10 minutes automatically
5. **OTP can only be used once** (marked as used in DB)

---

## 🌍 **International Numbers**

To send to other countries, update the country code in `authController.js`:

```javascript
// Current (India):
to: `+91${phone}`

// USA/Canada:
to: `+1${phone}`

// UK:
to: `+44${phone}`

// Or make it dynamic:
to: `${countryCode}${phone}`
```

---

## ✅ **Current Features**

Your OTP system now supports:
- ✅ Real SMS via Twilio
- ✅ Fallback to console logging (development)
- ✅ 6-digit random OTP
- ✅ 10-minute expiration
- ✅ One-time use validation
- ✅ Auto user registration
- ✅ Database tracking
- ✅ Beautiful toast notifications

---

## 🐛 **Troubleshooting**

### **SMS not received?**
1. Check Twilio Console → **Logs** → **Messaging Logs**
2. Verify phone number format: `+919876543210`
3. Ensure number is verified (trial account)
4. Check Twilio account balance

### **Twilio Error in Console?**
```bash
Twilio SMS Error: The number +919876543210 is unverified
```
**Solution:** Add the number to Twilio Verified Caller IDs

### **Still showing modal with OTP?**
- This is normal when Twilio is not configured
- Once Twilio is set up, modal won't show the OTP in production

---

## 🎯 **Next Steps**

1. ✅ Get Twilio account (Free)
2. ✅ Add credentials to `.env`
3. ✅ Verify your number (trial)
4. ✅ Restart backend
5. ✅ Test real SMS!

**Ready to send real OTPs!** 🚀📱

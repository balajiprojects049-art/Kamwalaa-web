# WhatsApp Integration Setup Guide

## ✅ What Has Been Implemented

1. **WhatsApp Service** (`src/utils/whatsappService.js`)
   - Uses `whatsapp-web.js` (100% FREE - no third-party costs)
   - Sends booking notifications to admin WhatsApp: **9030545655**
   - Automatically formats booking and address details

2. **Payment Confirmation Endpoint** (`/api/v1/bookings/:id/confirm-payment`)
   - Triggered when user completes payment
   - Sends data to:
     - ✅ Admin WhatsApp (9030545655)
     - ✅ Admin Panel (via Socket.io)

3. **Auto-initialization**
   - WhatsApp service starts when server starts
   - Reconnects automatically if disconnected

---

## 📱 How to Activate WhatsApp

### **IMPORTANT: One-Time Setup Required**

When you first start the server, you need to link your WhatsApp account:

1. **Start the Backend Server**
   ```powershell
   cd kamwalaa-backend
   npm run dev
   ```

2. **Scan the QR Code**
   - A QR code will appear in your terminal
   - Open WhatsApp on your phone
   - Go to: **Settings > Linked Devices > Link a Device**
   - Scan the QR code displayed in terminal

3. **Done!**
   - Once scanned, WhatsApp will stay connected
   - Session is saved locally (no need to scan again)
   - Server will auto-reconnect even after restart

---

## 🎯 How It Works

### **User Flow:**
1. User fills address details in booking form
2. Clicks "Next" button
3. **Completes payment** ✅
4. Your frontend calls: `PUT /api/v1/bookings/:bookingId/confirm-payment`

### **Backend automaticall sends:**

**📱 WhatsApp Message to 9030545655:**
```
🎉 NEW BOOKING RECEIVED 🎉

📋 Booking ID: KMWL-001
✅ Payment Status: PAID
💰 Amount: ₹500

👤 CUSTOMER DETAILS
━━━━━━━━━━━━━━━━━━━━
Name: John Doe
Phone: +919876543210

🛠️ SERVICE DETAILS
━━━━━━━━━━━━━━━━━━━━
Service: House Cleaning
Date: 2024-02-15
Time: 10:00 AM

📍 SERVICE ADDRESS
━━━━━━━━━━━━━━━━━━━━
123 Main Street
Apartment 4B
Hyderabad, Telangana - 500001
Landmark: Near City Mall

📝 Special Instructions:
Please bring eco-friendly cleaning products

━━━━━━━━━━━━━━━━━━━━
🚀 Action Required: Please assign a partner to this booking.
```

**🖥️ Admin Panel Notification:**
- Real-time notification via Socket.io
- Shows all booking and address details
- Appears instantly in admin dashboard

---

## 🔧 Frontend Integration

Update your payment success handler:

```javascript
// After payment is successful
const confirmPayment = async (bookingId, paymentId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/bookings/${bookingId}/confirm-payment`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentId,
          payment_method: 'razorpay' // or 'cod', 'upi', etc.
        })
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Payment confirmed & notifications sent!');
      // Show success message to user
      // Redirect to booking confirmation page
    }
  } catch (error) {
    console.error('Payment confirmation failed:', error);
  }
};
```

---

## 📊 Testing

### Test the WhatsApp Service:

1. **Check WhatsApp Status:**
   ```javascript
   const { getWhatsAppStatus } = require('./src/utils/whatsappService');
   console.log(getWhatsAppStatus());
   ```

2. **Manual Test:**
   - Create a booking
   - Call the payment confirmation endpoint
   - Check WhatsApp number 9030545655
   - Check admin panel for notification

---

## 🐛 Troubleshooting

### QR Code Not Showing?
- Make sure terminal is wide enough
- Check if `qrcode-terminal` is installed
- Restart the server

### WhatsApp Not Sending?
- Check if QR code was scanned
- Look for "✅ WhatsApp client is ready!" message
- Verify phone number format: `919030545655` (no + or spaces)

### Messages Not Appearing?
- Check your server logs
- Ensure WhatsApp Web is not logged in elsewhere
- Session may have expired - rescan QR code

---

## 🎉 Benefits

✅ **100% FREE** - No Twilio, MSG91, or other paid services  
✅ **Real WhatsApp** - Uses your actual WhatsApp account  
✅ **Reliable** - Auto-reconnects if disconnected  
✅ **Complete Data** - Sends all booking & address details  
✅ **Dual Notification** - Both WhatsApp & Admin Panel  

---

## 📝 Notes

- WhatsApp session is saved in `whatsapp-session` folder
- Session persists even after server restart
- Only need to scan QR code once (first time)
- Can use same WhatsApp for multiple servers
- Safe to commit code (session folder in .gitignore)

---

## 🚀 Ready to Go!

Your system is now configured to send booking details to:
- **WhatsApp:** 9030545655
- **Admin Panel:** Real-time notifications

Just start the server and scan the QR code! 📱✨

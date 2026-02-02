// TEMPORARILY DISABLED: whatsapp-web.js requires Chromium which isn't available on Railway
// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');

let whatsappClient = null;
let isReady = false;

// Admin WhatsApp number (with country code, no + or spaces)
const ADMIN_WHATSAPP = '919030545655'; // India country code + number

/**
 * Initialize WhatsApp Client
 * DISABLED: WhatsApp Web.js requires a browser environment (Chromium)
 * Railway/Render doesn't support this. Use Twilio WhatsApp API instead for production.
 */
const initializeWhatsApp = () => {
    console.log('⚠️ WhatsApp Web.js is disabled (not compatible with Railway)');
    console.log('ℹ️ Booking notifications will only be sent via Socket.IO to admin panel');
    return null;

    /* ORIGINAL CODE - COMMENTED OUT FOR RAILWAY COMPATIBILITY
    if (whatsappClient) {
        console.log('📱 WhatsApp client already initialized');
        return whatsappClient;
    }

    console.log('📱 Initializing WhatsApp client...');
    
    whatsappClient = new Client({
        authStrategy: new LocalAuth({
            clientId: 'kamwalaa-admin',
            dataPath: './whatsapp-session'
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        }
    });

    // QR Code for first-time authentication
    whatsappClient.on('qr', (qr) => {
        console.log('\n📱 ========================================');
        console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP:');
        console.log('📱 ========================================\n');
        qrcode.generate(qr, { small: true });
        console.log('\n📱 Open WhatsApp > Linked Devices > Link a Device');
        console.log('📱 ========================================\n');
    });

    // Authentication successful
    whatsappClient.on('authenticated', () => {
        console.log('✅ WhatsApp authenticated successfully!');
    });

    // Client is ready
    whatsappClient.on('ready', () => {
        isReady = true;
        console.log('✅ WhatsApp client is ready!');
        console.log(`✅ Messages will be sent to: ${ADMIN_WHATSAPP}`);
    });

    // Authentication failed
    whatsappClient.on('auth_failure', (msg) => {
        console.error('❌ WhatsApp authentication failed:', msg);
        isReady = false;
    });

    // Disconnected
    whatsappClient.on('disconnected', (reason) => {
        console.log('⚠️ WhatsApp client disconnected:', reason);
        isReady = false;
    });

    // Initialize the client
    whatsappClient.initialize();

    return whatsappClient;
    */
};

/**
 * Send booking details to admin WhatsApp
 */
const sendBookingToWhatsApp = async (bookingData) => {
    try {
        if (!whatsappClient || !isReady) {
            console.log('⚠️ WhatsApp client not ready. Message will be queued.');
            return {
                success: false,
                message: 'WhatsApp client not ready'
            };
        }

        // Format the message
        const message = formatBookingMessage(bookingData);

        // Send message to admin number
        const chatId = `${ADMIN_WHATSAPP}@c.us`;
        await whatsappClient.sendMessage(chatId, message);

        console.log('✅ Booking details sent to WhatsApp successfully!');
        return {
            success: true,
            message: 'Sent to WhatsApp'
        };

    } catch (error) {
        console.error('❌ Error sending WhatsApp message:', error);
        return {
            success: false,
            message: error.message
        };
    }
};

/**
 * Format booking data into WhatsApp message
 */
const formatBookingMessage = (data) => {
    const {
        booking_number,
        customer_name,
        customer_phone,
        service_name,
        booking_date,
        booking_time,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        landmark,
        special_instructions,
        total_amount,
        payment_status
    } = data;

    let message = `🎉 *NEW BOOKING RECEIVED* 🎉\n\n`;
    message += `📋 *Booking ID:* ${booking_number}\n`;
    message += `✅ *Payment Status:* ${payment_status.toUpperCase()}\n`;
    message += `💰 *Amount:* ₹${total_amount}\n\n`;

    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Name: ${customer_name}\n`;
    message += `Phone: ${customer_phone}\n\n`;

    message += `🛠️ *SERVICE DETAILS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Service: ${service_name}\n`;
    message += `Date: ${booking_date}\n`;
    message += `Time: ${booking_time}\n\n`;

    message += `📍 *SERVICE ADDRESS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `${address_line1}\n`;
    if (address_line2) message += `${address_line2}\n`;
    message += `${city}, ${state} - ${pincode}\n`;
    if (landmark) message += `Landmark: ${landmark}\n`;

    if (special_instructions) {
        message += `\n📝 *Special Instructions:*\n${special_instructions}\n`;
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🚀 *Action Required:* Please assign a partner to this booking.`;

    return message;
};

/**
 * Get WhatsApp client status
 */
const getWhatsAppStatus = () => {
    return {
        initialized: whatsappClient !== null,
        ready: isReady,
        adminNumber: ADMIN_WHATSAPP
    };
};

module.exports = {
    initializeWhatsApp,
    sendBookingToWhatsApp,
    getWhatsAppStatus
};

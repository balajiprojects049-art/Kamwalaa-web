// WhatsApp Web.js integration
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let whatsappClient = null;
let isReady = false;

// Admin WhatsApp number (with country code, no + or spaces)
const ADMIN_WHATSAPP = '919030545655'; // India country code + number

/**
 * Initialize WhatsApp Client
 */
const initializeWhatsApp = () => {
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
};

/**
 * Send booking details to admin WhatsApp (Scenario 1)
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

        console.log('✅ Booking details sent to admin WhatsApp successfully!');
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
 * Send booking confirmation to customer (Scenario 2)
 */
const sendBookingConfirmationToCustomer = async (customerPhone, bookingData) => {
    try {
        if (!whatsappClient || !isReady) {
            console.log('⚠️ WhatsApp client not ready.');
            return { success: false, message: 'WhatsApp client not ready' };
        }

        const message = `✅ *Booking Confirmed!*\n\n` +
            `Hello ${bookingData.customer_name},\n\n` +
            `Your booking has been confirmed!\n\n` +
            `📋 *Booking ID:* ${bookingData.booking_number}\n` +
            `🛠️ *Service:* ${bookingData.service_name}\n` +
            `📅 *Date:* ${bookingData.booking_date}\n` +
            `⏰ *Time:* ${bookingData.booking_time}\n` +
            `💰 *Amount:* ₹${bookingData.total_amount}\n\n` +
            `Our team will reach you at the scheduled time.\n\n` +
            `Thank you for choosing Kamwalaa!`;

        const chatId = `${customerPhone.replace(/[^0-9]/g, '')}@c.us`;
        await whatsappClient.sendMessage(chatId, message);

        console.log(`✅ Confirmation sent to customer: ${customerPhone}`);
        return { success: true, message: 'Customer notified' };

    } catch (error) {
        console.error('❌ Error sending customer confirmation:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Send partner assignment notification to customer (Scenario 3)
 */
const sendPartnerAssignmentToCustomer = async (customerPhone, bookingData, partnerData) => {
    try {
        if (!whatsappClient || !isReady) {
            console.log('⚠️ WhatsApp client not ready.');
            return { success: false, message: 'WhatsApp client not ready' };
        }

        const message = `👨‍🔧 *Technician Assigned!*\n\n` +
            `Hello ${bookingData.customer_name},\n\n` +
            `Your service partner has been assigned!\n\n` +
            `👤 *Technician:* ${partnerData.partner_name}\n` +
            `📞 *Contact:* ${partnerData.partner_phone}\n` +
            `⭐ *Rating:* ${partnerData.rating || '4.5'}/5.0\n\n` +
            `📋 *Booking ID:* ${bookingData.booking_number}\n` +
            `📅 *Scheduled:* ${bookingData.booking_date} at ${bookingData.booking_time}\n\n` +
            `Your service partner will arrive on time.\n\n` +
            `Thank you for choosing Kamwalaa!`;

        const chatId = `${customerPhone.replace(/[^0-9]/g, '')}@c.us`;
        await whatsappClient.sendMessage(chatId, message);

        console.log(`✅ Partner assignment sent to customer: ${customerPhone}`);
        return { success: true, message: 'Customer notified about partner' };

    } catch (error) {
        console.error('❌ Error sending partner assignment notification:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Send service completion notification to customer (Scenario 4)
 */
const sendServiceCompletionToCustomer = async (customerPhone, bookingData) => {
    try {
        if (!whatsappClient || !isReady) {
            console.log('⚠️ WhatsApp client not ready.');
            return { success: false, message: 'WhatsApp client not ready' };
        }

        const message = `🎉 *Service Completed Successfully!*\n\n` +
            `Hello ${bookingData.customer_name},\n\n` +
            `Thank you for using Kamwalaa! Your service has been completed.\n\n` +
            `📋 *Invoice Details:*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `Booking ID: ${bookingData.booking_number}\n` +
            `Service: ${bookingData.service_name}\n` +
            `Amount: ₹${bookingData.total_amount}\n` +
            `Payment: ${bookingData.payment_method || 'Cash on Service'}\n` +
            `Status: ✅ Completed\n\n` +
            `👨‍🔧 Technician: ${bookingData.partner_name || 'N/A'}\n\n` +
            `📊 *How was your experience?*\n` +
            `Please rate our service and help us improve!\n\n` +
            `We appreciate your business!\n` +
            `- Team Kamwalaa`;

        const chatId = `${customerPhone.replace(/[^0-9]/g, '')}@c.us`;
        await whatsappClient.sendMessage(chatId, message);

        console.log(`✅ Service completion notification sent to customer: ${customerPhone}`);
        return { success: true, message: 'Completion notification sent' };

    } catch (error) {
        console.error('❌ Error sending completion notification:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Format booking data into WhatsApp message for admin
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
        payment_method,
        payment_status
    } = data;

    let message = `🎉 *NEW BOOKING RECEIVED* 🎉\n\n`;
    message += `📋 *Booking ID:* ${booking_number}\n`;
    message += `✅ *Payment:* ${payment_method || 'Cash on Service'}\n`;
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
    sendBookingConfirmationToCustomer,
    sendPartnerAssignmentToCustomer,
    sendServiceCompletionToCustomer,
    getWhatsAppStatus
};

// Simple test: Directly call confirmPayment with an existing booking ID
const axios = require('axios');

async function testWhatsAppSend() {
    console.log('🧪 Testing WhatsApp notification...\n');

    // Replace this with an actual booking ID from your database
    const testBookingId = '00000000-0000-0000-0000-000000000001'; // CHANGE THIS!

    console.log(`Confirming payment for booking: ${testBookingId}...\n`);

    try {
        const response = await axios.put(
            `http://localhost:5000/api/v1/bookings/${testBookingId}/confirm-payment`,
            {
                payment_id: `TEST_${Date.now()}`,
                payment_method: 'test'
            }
        );

        console.log('✅ SUCCESS!');
        console.log('Response:', response.data);
        console.log('\n📱 Check WhatsApp (9030545655) now!');

    } catch (error) {
        console.error('❌ ERROR:', error.response?.data || error.message);
    }
}

testWhatsAppSend();

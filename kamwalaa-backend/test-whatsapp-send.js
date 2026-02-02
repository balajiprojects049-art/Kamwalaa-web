// Test script to verify WhatsApp is working
// Run this with: node test-whatsapp-send.js

const axios = require('axios');

const testPaymentConfirmation = async () => {
    console.log('🧪 Testing WhatsApp Payment Confirmation...\n');

    // First, create a test booking
    console.log('Step 1: Creating test booking...');
    const bookingPayload = {
        user_id: '1', // Use your existing user ID
        service_id: '1', // Use an existing service ID
        booking_date: '2026-02-15',
        booking_time: '10:00 AM',
        address_line1: 'Test Address Line 1',
        address_line2: 'Test Address Line 2',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        landmark: 'Near Test Landmark',
        special_instructions: 'This is a test booking for WhatsApp verification',
        payment_method: 'cash'
    };

    try {
        const createResponse = await fetch('http://localhost:5000/api/v1/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingPayload)
        });

        if (!createResponse.ok) {
            console.error('❌ Booking creation failed!');
            console.error('Status:', createResponse.status);
            const error = await createResponse.text();
            console.error('Error:', error);
            return;
        }

        const bookingResult = await createResponse.json();
        console.log('✅ Booking created:', bookingResult.data.booking_number);
        console.log('   Booking ID (UUID):', bookingResult.data.id);

        const bookingId = bookingResult.data.id;

        // Step 2: Confirm payment (this triggers WhatsApp)
        console.log('\nStep 2: Confirming payment (triggering WhatsApp)...');

        const confirmResponse = await fetch(`http://localhost:5000/api/v1/bookings/${bookingId}/confirm-payment`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                payment_id: `TEST_${Date.now()}`,
                payment_method: 'cash'
            })
        });

        if (!confirmResponse.ok) {
            console.error('❌ Payment confirmation failed!');
            console.error('Status:', confirmResponse.status);
            const error = await confirmResponse.text();
            console.error('Error:', error);
            return;
        }

        const confirmResult = await confirmResponse.json();
        console.log('✅ Payment confirmed successfully!');
        console.log('   Response:', confirmResult.message);

        console.log('\n🎉 Test completed!');
        console.log('📱 Check WhatsApp (9030545655) for the message!');
        console.log('🖥️  Check admin panel for real-time notification!');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
};

// Run the test
testPaymentConfirmation();

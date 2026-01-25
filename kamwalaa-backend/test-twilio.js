require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function testTwilio() {
    console.log('Testing Twilio...');
    console.log('SID:', process.env.TWILIO_ACCOUNT_SID ? 'OK' : 'MISSING');
    console.log('Token:', process.env.TWILIO_AUTH_TOKEN ? 'OK' : 'MISSING');
    console.log('From:', process.env.TWILIO_PHONE_NUMBER);
    console.log('To:', '+919030545655');

    try {
        const message = await client.messages.create({
            body: 'Kamwalaa Twilio Test: Your OTP is 123456',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: '+919030545655'
        });
        console.log('✅ SMS SUCCESS!');
        console.log('SID:', message.sid);
    } catch (error) {
        console.error('❌ SMS FAILED:');
        console.error(error.message);
        console.error('Detailed:', error);
    }
}

testTwilio();

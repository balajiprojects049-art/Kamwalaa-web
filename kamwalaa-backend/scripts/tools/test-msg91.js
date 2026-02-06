require('dotenv').config();
const axios = require('axios');

async function testSMS() {
    console.log('Testing MSG91 SMS...');
    console.log('Auth Key:', process.env.MSG91_AUTH_KEY ? 'Present' : 'Missing');
    console.log('Template ID:', process.env.MSG91_TEMPLATE_ID);

    try {
        const payload = {
            mobile: "919030545655", // Using your number directly
            authkey: process.env.MSG91_AUTH_KEY,
            otp: "123456",
            otp_expiry: 10
        };

        if (process.env.MSG91_TEMPLATE_ID) {
            payload.template_id = process.env.MSG91_TEMPLATE_ID;
        }

        console.log('Sending payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post("https://control.msg91.com/api/v5/otp", payload, {
            headers: {
                'authkey': process.env.MSG91_AUTH_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('ERROR:');
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testSMS();

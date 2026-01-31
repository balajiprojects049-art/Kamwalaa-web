const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, adminLogin, phoneLogin, setPin, pinLogin, register } = require('../controllers/authController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', phoneLogin);
router.post('/set-pin', setPin);
router.post('/pin-login', pinLogin);
router.post('/admin/login', adminLogin);

module.exports = router;

const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, adminLogin, phoneLogin, setPin, pinLogin, register, resetPasswordWithPin, resetPinWithPassword } = require('../controllers/authController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', phoneLogin);
router.post('/set-pin', setPin);
router.post('/pin-login', pinLogin);
router.post('/admin/login', adminLogin);
router.post('/reset-password-pin', resetPasswordWithPin);
router.post('/reset-pin-password', resetPinWithPassword);

module.exports = router;

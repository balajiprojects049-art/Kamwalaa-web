const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus,
    confirmPayment,
    assignPartner,
    getPartnerBookings
} = require('../controllers/bookingController');
const { protect, adminOnly, protectAdmin } = require('../middleware/authMiddleware');
router.post('/', createBooking); // Allow guest bookings
router.get('/', protectAdmin, getAllBookings);
router.get('/user/:userId', protect, getUserBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/confirm-payment', protect, confirmPayment);
router.put('/:id/assign', protect, assignPartner);
router.get('/partner/:partnerId', protect, getPartnerBookings);

module.exports = router;

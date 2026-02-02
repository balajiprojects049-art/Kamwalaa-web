const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus,
    confirmPayment
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/user/:userId', protect, getUserBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/confirm-payment', protect, confirmPayment);

module.exports = router;
